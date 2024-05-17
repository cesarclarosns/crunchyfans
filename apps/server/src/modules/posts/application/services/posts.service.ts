import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MediaService } from '@/modules/media/application/services/media.service';
import { UsersService } from '@/modules/users/application/services/users.service';

import { CreatePostDto } from '../../domain/dtos/create-post.dto';
import { CreatePostCommentDto } from '../../domain/dtos/create-post-comment.dto';
import { FindAllPostCommentsDto } from '../../domain/dtos/find-all-post-comments.dto';
import { FindAllPostsDto } from '../../domain/dtos/find-all-posts.dto';
import { GetFeedDto } from '../../domain/dtos/get-feed.dto';
import { PostDto } from '../../domain/dtos/post.dto';
import { UpdatePostDto } from '../../domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '../../domain/dtos/update-post-comment.dto';
import { Post } from '../../domain/entities/post.entity';
import { PostComment } from '../../domain/entities/post-comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectPinoLogger(PostsService.name) private readonly logger: PinoLogger,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly mediaService: MediaService,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostDto> {
    const post = await this.postModel.create(createPostDto);
    return post.toJSON();
  }

  async findAllPosts(
    { limit, skip, cursor }: FindAllPostsDto,
    toUserId?: string,
  ): Promise<PostDto[]> {
    this.logger.trace('findAllPosts');

    let documents = await this.postModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(toUserId),
          ...(!!cursor
            ? {
                _id: { $lt: new mongoose.Types.ObjectId(cursor) },
              }
            : {}),
        },
      },
      {
        $set: {
          createdAt: { $toDate: '$_id' },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
      ...(!!toUserId
        ? [
            {
              $lookup: {
                as: 'isLiked',
                foreignField: 'postId',
                from: 'postLikes',
                localField: '_id',
                pipeline: [
                  {
                    $match: {
                      userId: new mongoose.Types.ObjectId(toUserId),
                    },
                  },
                ],
              },
            },
            {
              $set: {
                isLiked: {
                  $cond: {
                    else: false,
                    if: {
                      $ne: ['$isLiked', []],
                    },
                    then: true,
                  },
                },
              },
            },
          ]
        : []),
    ]);

    documents = await this.postModel.populate(documents, [{ path: 'media' }]);

    const posts: PostDto[] = documents.map((doc) => doc.toJSON());

    for (const post of posts) {
    }

    this.logger.trace({ posts }, 'findAllPosts done');

    return posts;
  }

  async findOnePostById(
    postId: string,
    toUserId?: string,
  ): Promise<PostDto | null> {
    let documents = await this.postModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      ...(!!toUserId
        ? [
            {
              $lookup: {
                as: 'isLiked',
                foreignField: 'postId',
                from: 'postLike',
                localField: '_id',
                pipeline: [
                  {
                    $match: {
                      userId: new mongoose.Types.ObjectId(toUserId),
                    },
                  },
                ],
              },
            },
            {
              $set: {
                isLiked: {
                  $cond: {
                    else: false,
                    if: {
                      $ne: ['$isLiked', []],
                    },
                    then: true,
                  },
                },
              },
            },
          ]
        : []),
    ]);

    documents = await this.postModel.populate(documents, [{ path: 'media' }]);

    const document = documents.at(0);
    if (!document) return null;

    const post = document.toJSON();
    return post;
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    return await this.postModel.findOneAndUpdate(
      { _id: postId },
      updatePostDto,
      {
        new: true,
      },
    );
  }

  async removePost(postId: string) {
    return await this.postModel.deleteOne({
      _id: postId,
    });
  }

  async createPostLike({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const document = await this.postLikeModel.findOneAndUpdate(
        {
          postId,
          userId,
        },
        {},
        { new: true, session, upsert: true },
      );

      if (document) {
        await this.postModel.updateOne(
          { _id: postId },
          {
            $inc: {
              likesCount: 1,
            },
          },
          {
            session,
          },
        );
      }

      await session.commitTransaction();
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async deletePostLike({ postId, userId }: { postId: string; userId: string }) {
    this.logger.debug('deletePostLike');

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await this.postLikeModel.deleteOne(
        {
          postId,
          userId,
        },
        { session },
      );

      if (result.deletedCount) {
        await this.postModel.updateOne(
          { _id: postId },
          {
            $inc: {
              likesCount: -1,
            },
          },
          {
            session,
          },
        );
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }

    this.logger.debug('deletePostLike done');
  }

  async createPostComment(createPostCommentDto: CreatePostCommentDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.postCommentModel.insertMany([createPostCommentDto], {
        session,
      });

      await this.postModel.updateOne(
        { _id: createPostCommentDto.postId },
        {
          $inc: {
            commentsCount: 1,
          },
        },
        { session },
      );

      if (!!createPostCommentDto.postCommentId) {
        await this.postCommentModel.updateOne(
          { _id: createPostCommentDto.postCommentId },
          {
            $inc: {
              commentsCount: 1,
            },
          },
          {
            session,
          },
        );
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAllPostComments(
    { limit, skip, postId, postCommentId, cursor }: FindAllPostCommentsDto,
    toUserId?: string,
  ) {
    const documents = await this.postCommentModel.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          ...(postCommentId
            ? {
                postCommentId: new mongoose.Types.ObjectId(postCommentId),
              }
            : {
                postCommentId: { $exists: false },
              }),
          ...(!!cursor
            ? {
                _id: {
                  $gt: new mongoose.Types.ObjectId(cursor),
                },
              }
            : {}),
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
      {
        $set: {
          createdAt: {
            $toDate: '$_id',
          },
        },
      },
      ...(!!toUserId
        ? [
            {
              $lookup: {
                as: 'isLiked',
                foreignField: 'postCommentId',
                from: 'postCommentLikes',
                localField: '_id',
                pipeline: [
                  {
                    $match: {
                      userId: new mongoose.Types.ObjectId(toUserId),
                    },
                  },
                ],
              },
            },
            {
              $set: {
                isLiked: {
                  $cond: {
                    else: false,
                    if: {
                      $ne: ['$isLiked', []],
                    },
                    then: true,
                  },
                },
              },
            },
          ]
        : []),
    ]);

    return [];
  }

  async updatePostComment(
    postCommentId: string,
    updatePostCommendDto: UpdatePostCommentDto,
  ) {
    const document = await this.postCommentModel.findOneAndUpdate(
      { _id: postCommentId },
      updatePostCommendDto,
      { new: true },
    );

    if (document) {
    }
    return null;
  }

  async deletePostComment(postCommentId: string) {
    const postComment = await this.postCommentModel.findById(postCommentId);
    if (!postComment) throw new BadRequestException('Post not found');

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const result = await this.postCommentModel.deleteOne(
        {
          _id: postCommentId,
        },
        { session },
      );

      if (result.deletedCount) {
        await this.postModel.updateOne(
          { _id: postComment.postId },
          { $inc: { commentsCount: -1 } },
          {
            session,
          },
        );

        if (postComment.postCommentId) {
          await this.postCommentModel.updateOne(
            { _id: postComment.postCommentId },
            { $inc: { commentsCount: -1 } },
            {
              session,
            },
          );
        }
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  async createPostCommentLike(filter: {
    postCommentId: string;
    userId: string;
  }) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await session.withTransaction(async () => {
        const document = await this.postCommentLikeModel.findOneAndUpdate(
          { postCommentId: filter.postCommentId, userId: filter.userId },
          {},
          { new: true, session, upsert: true },
        );

        if (document) {
          await this.postCommentModel.updateOne(
            { _id: filter.postCommentId },
            {
              $inc: {
                likesCount: 1,
              },
            },
            {
              session,
            },
          );
        }
      });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async deletePostCommentLike(filter: {
    postCommentId: string;
    userId: string;
  }) {
    const session = await this.connection.startSession();

    try {
      const result = await this.postCommentLikeModel.deleteOne(
        {
          postCommentId: filter.postCommentId,
          userId: filter.userId,
        },
        { session },
      );

      if (result.deletedCount) {
        await this.postCommentModel.updateOne(
          { _id: filter.postCommentId },
          {
            $inc: {
              likesCount: -1,
            },
          },
          {
            session,
          },
        );
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}

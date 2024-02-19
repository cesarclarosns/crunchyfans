import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Follower } from '../followers/entities/follower.entity';
import { FOLLOWER_STATUS } from '../followers/followers.constants';
import { MediaService } from '../media/media.service';
import { StorageService } from '../media/storage.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { FindAllPostCommentsDto } from './dto/find-all-post-comments.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { GetFeedDto } from './dto/get-feed.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdatePostCommentDto } from './dto/update-post-comment.dto';
import { Post, TPostFilterQuery } from './entities/post.entity';
import {
  PostComment,
  TPostCommentFilterQuery,
} from './entities/post-comment.entity';
import { PostCommentLike } from './entities/post-comment-like.entity';
import { PostLike } from './entities/post-like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLike>,
    @InjectModel(PostComment.name)
    private readonly postCommentModel: Model<PostComment>,
    @InjectModel(PostCommentLike.name)
    private readonly postCommentLikeModel: Model<PostCommentLike>,
    @InjectModel(Follower.name) private readonly followerModel: Model<Follower>,
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const post = await this.postModel.create(createPostDto);
    return post;
  }

  async getFeed({ skip, limit, cursor, userId }: GetFeedDto) {
    let posts = await this.followerModel.aggregate([
      {
        $match: {
          followerId: new mongoose.Types.ObjectId(userId),
          status: FOLLOWER_STATUS.accepted,
        },
      },
      {
        $lookup: {
          as: 'posts',
          foreignField: 'userId',
          from: 'posts',
          localField: 'followeeId',
          pipeline: [
            ...(!!cursor
              ? [
                  {
                    $match: {
                      _id: {
                        $lt: new mongoose.Types.ObjectId(cursor),
                      },
                    },
                  },
                ]
              : []),
            {
              $set: {
                createdAt: {
                  $toDate: '$_id',
                },
              },
            },
          ],
        },
      },
      {
        $unwind: '$posts',
      },
      {
        $replaceWith: '$posts',
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
      {
        $lookup: {
          as: 'isLiked',
          foreignField: 'postId',
          from: 'postLikes',
          localField: '_id',
          pipeline: [
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
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
    ]);

    posts = await this.postModel.populate(posts, [
      {
        path: 'user',
        populate: { path: 'pictures.profilePicture' },
        select: '-password -oauth -settings -metadata',
      },
      { path: 'media' },
    ]);

    posts = JSON.parse(JSON.stringify(posts));

    for (const post of posts as PostDto[]) {
      if (post.user) {
        this.usersService.downloadPictures(post.user);
      }
      if (post.media) {
        for (const media of post.media) {
          this.mediaService.downloadMedia(media);
        }
      }
    }

    return posts;
  }

  async findAllPosts({ limit, skip, user, cursor, userId }: FindAllPostsDto) {
    let posts = await this.postModel.aggregate([
      {
        $match: {
          ...(!!user
            ? {
                userId: new mongoose.Types.ObjectId(user),
              }
            : {}),
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
      ...(!!userId
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
                      userId: new mongoose.Types.ObjectId(userId),
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

    posts = await this.postModel.populate(posts, [
      {
        path: 'user',
        populate: {
          path: 'pictures.profilePicture',
        },
        select: '-password -oauth -settings -metadata',
      },
      { path: 'media' },
    ]);

    posts = JSON.parse(JSON.stringify(posts));

    for (const post of posts as PostDto[]) {
      if (post.user) {
        this.usersService.downloadPictures(post.user);
      }
      if (post.media) {
        for (const media of post.media) {
          this.mediaService.downloadMedia(media);
        }
      }
    }

    return posts;
  }

  async findOnePost({
    postId,
    requesterId,
  }: {
    postId: string;
    requesterId: string;
  }) {
    let posts = await this.postModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $set: {
          createdAt: { $toDate: '$_id' },
        },
      },
      ...(!!requesterId
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
                      userId: new mongoose.Types.ObjectId(requesterId),
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

    posts = await this.postModel.populate(posts, [
      {
        path: 'user',
        populate: {
          path: 'pictures.profilePicture',
        },
        select: '-password -oauth -settings -metadata',
      },
      { path: 'media' },
    ]);

    posts = JSON.parse(JSON.stringify(posts));

    for (const post of posts as PostDto[]) {
      if (post.user) {
        this.usersService.downloadPictures(post.user);
      }
      if (post.media) {
        for (const media of post.media) {
          this.mediaService.downloadMedia(media);
        }
      }
    }

    return posts.at(0);
  }

  async updatePost(
    filter: { _id: string; userId: string },
    updatePostDto: UpdatePostDto,
  ) {
    return await this.postModel.findOneAndUpdate(filter, updatePostDto, {
      new: true,
    });
  }

  async removePost(filter: { _id: string; userId: string }) {
    return await this.postModel.deleteOne(filter);
  }

  async createPostLike({ postId, userId }: { postId: string; userId: string }) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const result = await this.postLikeModel.updateOne(
          { postId, userId },
          {},
          { session, upsert: true },
        );

        if (result.upsertedCount) {
          await this.postModel.updateOne(
            { _id: postId },
            {
              $inc: {
                'metadata.likesCount': 1,
              },
            },
            {
              session,
            },
          );
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async deletePostLike(filter: { postId: string; userId: string }) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const deleteResult = await this.postLikeModel.deleteOne(
          { postId: filter.postId, userId: filter.userId },
          { session },
        );

        if (deleteResult.deletedCount) {
          await this.postModel.updateOne(
            { _id: filter.postId },
            {
              $inc: {
                'metadata.likesCount': -1,
              },
            },
            {
              session,
            },
          );
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async createPostComment(createPostCommentDto: CreatePostCommentDto) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const postComments = await this.postCommentModel.insertMany(
          [createPostCommentDto],
          {
            session,
          },
        );
        const postComment = postComments[0];

        if (createPostCommentDto.postCommentId) {
          await this.postCommentModel.updateOne(
            { _id: createPostCommentDto.postCommentId },
            {
              $inc: {
                'metadata.commentsCount': 1,
              },
            },
            {
              session,
            },
          );
        } else {
          await this.postModel.updateOne(
            { _id: createPostCommentDto.postId },
            {
              $inc: {
                'metadata.commentsCount': 1,
              },
            },
            {
              session,
            },
          );
        }

        return postComment;
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAllPostComments({
    limit,
    skip,
    postId,
    postCommentId,
    cursor,
    userId,
  }: FindAllPostCommentsDto) {
    let postComments = await this.postCommentModel.aggregate([
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
      ...(!!userId
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
                      userId: new mongoose.Types.ObjectId(userId),
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

    postComments = await this.postCommentModel.populate(postComments, [
      {
        path: 'user',
        populate: {
          path: 'pictures.profilePicture',
        },
        select: '-password -oauth -settings -metadata',
      },
    ]);

    postComments = JSON.parse(JSON.stringify(postComments));

    for (const postComment of postComments) {
      if (postComment.user) {
        this.usersService.downloadPictures(postComment.user);
      }
    }

    return postComments;
  }

  async updatePostComment(
    filter: TPostCommentFilterQuery,
    updatePostCommendDto: UpdatePostCommentDto,
  ) {
    return await this.postCommentModel.updateOne(filter, updatePostCommendDto);
  }

  async deletePostComment(filter: { userId: string; postCommentId: string }) {
    const session = await this.connection.startSession();

    const postComment = await this.postCommentModel.findById(
      filter.postCommentId,
    );

    try {
      await session.withTransaction(async () => {
        const result = await this.postCommentModel.deleteOne(
          {
            _id: filter.postCommentId,
            userId: filter.userId,
          },
          { session },
        );

        if (result.deletedCount) {
          if (postComment.postCommentId) {
            await this.postCommentModel.updateOne(
              { _id: postComment.postCommentId },
              { $inc: { 'metadata.commentsCount': -1 } },
              {
                session,
              },
            );
          } else {
            await this.postModel.updateOne(
              { _id: postComment.postId },
              { $inc: { 'metadata.commentsCount': -1 } },
              {
                session,
              },
            );
          }
        }
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async createPostCommentLike(filter: {
    postCommentId: string;
    userId: string;
  }) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const result = await this.postCommentLikeModel.updateOne(
          { postCommentId: filter.postCommentId, userId: filter.userId },
          {},
          { session, upsert: true },
        );

        if (result.upsertedCount) {
          await this.postCommentModel.updateOne(
            { _id: filter.postCommentId },
            {
              $inc: {
                'metadata.likesCount': 1,
              },
            },
            {
              session,
            },
          );
        }
      });
    } catch (err) {
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
      await session.withTransaction(async () => {
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
                'metadata.likesCount': -1,
              },
            },
            {
              session,
            },
          );
        }
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }
}

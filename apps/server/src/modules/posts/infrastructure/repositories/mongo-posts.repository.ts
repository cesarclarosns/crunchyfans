import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { IMediaRepository } from '@/modules/media/domain/repositories/media.repository';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { CreatePostCommentDto } from '@/modules/posts/domain/dtos/create-post-comment.dto';
import { GetPostsDto } from '@/modules/posts/domain/dtos/get-posts.dto';
import { UpdatePostDto } from '@/modules/posts/domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '@/modules/posts/domain/dtos/update-post-comment.dto';
import {
  Post,
  PostComment,
  PostCommentWithViewerData,
  PostWithViewerData,
  UserPost,
} from '@/modules/posts/domain/entities';
import { IPostsRepository } from '@/modules/posts/domain/repositories/posts.repository';
import {
  MongoPost,
  MongoPostComment,
  MongoUserPost,
  MongoUserPostComment,
  MongoUserPosts,
} from '@/modules/posts/infrastructure/entities';

@Injectable()
export class MongoPostsRepository implements IPostsRepository {
  constructor(
    @InjectPinoLogger(MongoPostsRepository.name)
    private readonly _logger: PinoLogger,
    @Inject(IMediaRepository)
    private readonly _mediaRepository: IMediaRepository,
    @InjectModel(MongoPost.name)
    private readonly _postModel: Model<MongoPost>,
    @InjectModel(MongoPostComment.name)
    private readonly _postCommentModel: Model<MongoPostComment>,
    @InjectModel(MongoUserPost.name)
    private readonly _userPostModel: Model<MongoUserPost>,
    @InjectModel(MongoUserPostComment.name)
    private readonly _userPostCommentModel: Model<MongoUserPostComment>,
    @InjectModel(MongoUserPosts.name)
    private readonly _userPostsModel: Model<MongoUserPosts>,
  ) {}

  async createPost(create: CreatePostDto, uow: MongoUnitOfWork): Promise<Post> {
    // Get medias
    const medias = await this._mediaRepository.getMedias({
      ids: create.medias.map((media) => media.mediaId),
    });

    // Update userPostsData
    await this._userPostsModel.findOneAndUpdate(
      {
        userId: create.userId,
      },
      { postsCount: { $inc: 1 } },
      {
        session: uow.session,
        upsert: true,
      },
    );

    const [_post] = await this._postModel.insertMany([create], {
      session: uow.session,
    });

    const post = new Post(_post.toJSON());
    return post;
  }

  async getPostsWithViewerData(
    filter: GetPostsDto,
    viewerId: string,
  ): Promise<PostWithViewerData[]> {
    console.log(filter, viewerId);

    return [];
  }

  async getPostById(postId: string): Promise<Post | null> {
    const _post = await this._postModel.findById(postId);
    if (!_post) return null;

    const post = new Post(_post.toJSON());
    return post;
  }

  async getPostWithViewerDataById(
    postId: string,
    viewerId: string,
  ): Promise<PostWithViewerData | null> {
    const _post = await this._postModel.findById(postId);
    if (!_post) return null;

    return null;
  }

  async updatePost(
    postId: string,
    update: UpdatePostDto,
  ): Promise<Post | null> {
    const _post = await this._postModel.findByIdAndUpdate(
      postId,
      { $set: update },
      {
        new: true,
      },
    );
    if (!_post) return null;

    const post = new Post(_post.toJSON());
    return post;
  }

  async deletePost(postId: string): Promise<Post | null> {
    const _post = await this._postModel.findByIdAndDelete(postId);
    if (!_post) return null;

    const post = new Post(_post.toJSON());
    return post;
  }

  async createPostComment(create: CreatePostCommentDto): Promise<PostComment> {
    const _postComment = await this._postCommentModel.create(create);

    const postComment = new PostComment(_postComment.toJSON());
    return postComment;
  }

  async getPostCommentsWithViewerData(
    filter: any,
    viewerId: string,
  ): Promise<PostCommentWithViewerData[]> {
    return [];
  }

  async getPostCommentById(postCommentId: string): Promise<PostComment | null> {
    const _postComment = await this._postCommentModel.findById(postCommentId);
    if (!_postComment) return null;

    const postComment = new PostComment(_postComment.toJSON());
    return postComment;
  }

  async updatePostComment(
    postCommentId: string,
    update: UpdatePostCommentDto,
  ): Promise<PostComment | null> {
    const _postComment = await this._postCommentModel.findByIdAndUpdate(
      postCommentId,
      { $set: update },
      { new: true },
    );
    if (!_postComment) return null;

    const postComment = new PostComment(_postComment.toJSON());
    return postComment;
  }

  async deletePostComment(
    postCommentId: string,
    uow: MongoUnitOfWork,
  ): Promise<PostComment | null> {
    const _postComment =
      await this._postCommentModel.findByIdAndDelete(postCommentId);
    if (!_postComment) return null;

    const postComment = new PostComment(_postComment.toJSON());
    return postComment;
  }

  async setPostAsLiked(postId: string, userId: string): Promise<UserPost> {
    throw new Error();
  }

  // async setPostAsLiked(postId: string, userId: string): Promise<void> {
  //   const [_userPost, _post, _userPostsData] = await Promise.all([
  //     this._userPostModel.findOneAndUpdate(
  //       { postId, userId },
  //       { isLiked: true },
  //       { new: true, session, upsert: true },
  //     ),
  //     this._postModel.findByIdAndUpdate(
  //       postId,
  //       { $inc: { likesCount: 1 } },
  //       { new: true, session, upsert: true },
  //     ),
  //     this._userPostsModel.findOneAndUpdate(
  //       { userId },
  //       {
  //         $inc: { likesCount: 1 },
  //         $setOnInsert: {
  //           likesCount: 1,
  //         },
  //       },
  //       {
  //         new: true,
  //         session,
  //         upsert: true,
  //       },
  //     ),
  //   ]);
  // }

  async unsetPostAsLiked(
    postId: string,
    userId: string,
    uow: MongoUnitOfWork,
  ): Promise<UserPost> {
    throw new Error();
  }

  async setPostAsPurchased(
    postId: string,
    userId: string,
    uow: MongoUnitOfWork,
  ): Promise<UserPost> {
    throw new Error();
  }

  async unsetPostAsPurchased(
    postId: string,
    userId: string,
    uow: MongoUnitOfWork,
  ): Promise<UserPost> {
    throw new Error();
  }
}

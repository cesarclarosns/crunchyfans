import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work';
import {
  MongoDBContext,
  MongoUnitOfWork,
} from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { MediaService } from '@/modules/media/application/services/media.service';
import { MediaRepository } from '@/modules/media/infrastructure/repositories/media.repository';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { CreatePostCommentDto } from '@/modules/posts/domain/dtos/create-post-comment.dto';
import { UpdatePostDto } from '@/modules/posts/domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '@/modules/posts/domain/dtos/update-post-comment.dto';
import {
  Post as PostEntity,
  PostComment as PostCommentEntity,
  UserPost as UserPostEntity,
  UserPostComment as UserPostCommentEntity,
  UserPostsData as UserPostsDataEntity,
} from '@/modules/posts/domain/entities';
import {
  Post,
  PostComment,
  PostCommentWithViewerData,
  PostWithViewerData,
} from '@/modules/posts/domain/models';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectPinoLogger(PostsRepository.name)
    private readonly _logger: PinoLogger,
    private readonly _mediaRepository: MediaRepository,
    @InjectModel(PostEntity.name)
    private readonly _postModel: Model<PostEntity>,
    @InjectModel(PostCommentEntity.name)
    private readonly _postCommentModel: Model<PostCommentEntity>,
    @InjectModel(UserPostEntity.name)
    private readonly _userPostModel: Model<UserPostEntity>,
    @InjectModel(UserPostCommentEntity.name)
    private readonly _userPostCommentModel: Model<UserPostCommentEntity>,
    @InjectModel(UserPostsDataEntity.name)
    private readonly _userPostsDataModel: Model<UserPostsDataEntity>,
  ) {}

  async createPost(
    create: CreatePostDto,
    dbContext: MongoDBContext,
  ): Promise<Post> {
    if (!dbContext.session.inTransaction()) {
    }

    // Get medias
    const medias = await this._mediaRepository.getMedias({
      ids: create.medias.map((media) => media.mediaId),
    });

    // Update userPostsData
    await this._userPostsDataModel.findOneAndUpdate(
      {
        userId: create.userId,
      },
      { postsCount: { $inc: 1 } },
      {
        session: dbContext.session,
        upsert: true,
      },
    );

    const [_post] = await this._postModel.insertMany([create], {
      session: dbContext.session,
    });

    const post = new Post(_post.toJSON());
    return post;
  }

  async getPostsWithViewerData(
    filter: any,
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
    dbContext: MongoDBContext,
  ): Promise<PostComment | null> {
    const _postComment =
      await this._postCommentModel.findByIdAndDelete(postCommentId);
    if (!_postComment) return null;

    const postComment = new PostComment(_postComment.toJSON());
    return postComment;
  }

  async setPostAsLiked(postId: string, userId: string): Promise<void> {
    return;
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
  //     this._userPostsDataModel.findOneAndUpdate(
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

  async unsetPostAsLiked(postId: string, userId: string): Promise<void> {}

  async setPostAsPurchased(postId: string, userId: string): Promise<void> {}

  async unsetPostAsPurchased(postId: string, userId: string) {}
}

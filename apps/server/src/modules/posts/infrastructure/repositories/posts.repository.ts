import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MediaService } from '@/modules/media/application/services/media.service';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
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
    private readonly _mediaService: MediaService,
    @InjectConnection() private readonly _connection: mongoose.Connection,
    @InjectModel(PostEntity.name)
    private readonly _post: Model<PostEntity>,
    @InjectModel(PostCommentEntity.name)
    private readonly _postComment: Model<PostCommentEntity>,
    @InjectModel(UserPostEntity.name)
    private readonly _userPost: Model<UserPostEntity>,
    @InjectModel(UserPostCommentEntity.name)
    private readonly _userPostComment: Model<UserPostCommentEntity>,
    @InjectModel(UserPostsDataEntity.name)
    private readonly _userPostsData: Model<UserPostsDataEntity>,
  ) {}

  async createPost(create: CreatePostDto): Promise<Post> {
    throw new Error();
  }

  async getPostById(postId: string): Promise<Post | null> {
    return null;
  }

  async getPostWithViewerDataById(
    postId: string,
    viewerId: string,
  ): Promise<PostWithViewerData | null> {
    return null;
  }

  getPostCommentById: (postCommentId: string) => Promise<PostComment | null>;

  async updatePost(
    postId: string,
    update: UpdatePostDto,
  ): Promise<Post | null> {
    return null;
  }

  async deletePost(postId: string): Promise<Post | null> {
    return null;
  }

  getOnePostById: (postId: string) => Promise<Post | null>;

  getOnePostWithViewerDataById: (
    postId: string,
    viewerId: string,
  ) => Promise<PostWithViewerData>;

  getPostsWithViewerData: (
    filter: any,
    viewerId: string,
  ) => Promise<PostWithViewerData[]>;

  createPostComment: () => Promise<PostComment>;

  getOnePostCommentById: (postCommentId: string) => Promise<PostComment | null>;

  getPostCommentsWithViewerData: (
    filter: any,
    viewerId: string,
  ) => Promise<PostCommentWithViewerData[]>;

  updatePostComment: (
    postCommentId: string,
    update: UpdatePostCommentDto,
  ) => Promise<PostComment | null>;

  deletePostComment: (postCommentId: string) => Promise<PostComment | null>;

  createPostLike: (postId: string, userId: string) => Promise<boolean>;

  deletePostLike: (postId: string, userId: string) => Promise<boolean>;
}

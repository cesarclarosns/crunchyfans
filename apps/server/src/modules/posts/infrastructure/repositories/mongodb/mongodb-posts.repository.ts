import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { UpdatePostDto } from '@/modules/posts/domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '@/modules/posts/domain/dtos/update-post-comment.dto';
import {
  Post,
  PostWithViewerData,
} from '@/modules/posts/domain/models/post.model';
import {
  PostComment,
  PostCommentWithViewerData,
} from '@/modules/posts/domain/models/post-comment.model';
import { IPostRepository } from '@/modules/posts/domain/repositories/posts.repository';

import { PostLike } from './schemas/post-like.schema';

@Injectable()
export class MongodbPostsRepository implements IPostRepository {
  constructor(
    @InjectPinoLogger(MongodbPostsRepository.name)
    private readonly logger: PinoLogger,
  ) {}

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

  async createPost(create: CreatePostDto): Promise<Post> {
    throw new Error();
  }

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

  createPostLike: (postId: string, userId: string) => Promise<PostLike>;

  deletePostLike: (postId: string, userId: string) => Promise<PostLike | null>;
}

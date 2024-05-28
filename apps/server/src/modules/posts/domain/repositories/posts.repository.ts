import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work.factory';
import { CreatePostDto } from '@/modules/posts/domain/dtos/create-post.dto';
import { CreatePostCommentDto } from '@/modules/posts/domain/dtos/create-post-comment.dto';
import { GetPostCommentsDto } from '@/modules/posts/domain/dtos/get-post-comments.dto';
import { GetPostsDto } from '@/modules/posts/domain/dtos/get-posts.dto';
import { UpdatePostDto } from '@/modules/posts/domain/dtos/update-post.dto';
import { UpdatePostCommentDto } from '@/modules/posts/domain/dtos/update-post-comment.dto';
import {
  Post,
  PostComment,
  PostCommentWithViewerData,
  PostWithViewerData,
  UserPost,
} from '@/modules/posts/domain/models';

export interface IPostsRepository {
  createPost: (create: CreatePostDto, uow: IUnitOfWork) => Promise<Post>;

  getPostsWithViewerData: (
    filter: GetPostsDto,
    viewerId: string,
  ) => Promise<PostWithViewerData[]>;

  getPostById: (postId: string) => Promise<Post | null>;

  updatePost: (postId: string, update: UpdatePostDto) => Promise<Post | null>;

  deletePost: (postId: string) => Promise<Post | null>;

  createPostComment: (create: CreatePostCommentDto) => Promise<PostComment>;

  getPostCommentsWithViewerData: (
    filter: GetPostCommentsDto,
    viewerId: string,
  ) => Promise<PostCommentWithViewerData[]>;

  getPostCommentById: (postCommentId: string) => Promise<PostComment | null>;

  updatePostComment: (
    postCommentId: string,
    update: UpdatePostCommentDto,
  ) => Promise<PostComment | null>;

  deletePostComment: (
    postCommentId: string,
    uow: IUnitOfWork,
  ) => Promise<PostComment | null>;

  setPostAsLiked: (
    postId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserPost>;

  unsetPostAsLiked: (
    postId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserPost>;

  setPostAsPurchased: (
    postId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserPost>;

  unsetPostAsPurchased: (
    postId: string,
    userId: string,
    uow: IUnitOfWork,
  ) => Promise<UserPost>;
}

export const IPostsRepository = Symbol('IPostsRepository');

import { PostLike } from '../../infrastructure/repositories/mongodb/schemas/post-like.schema';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { UpdatePostCommentDto } from '../dtos/update-post-comment.dto';
import { Post, PostWithViewerData } from '../models/post.model';
import {
  PostComment,
  PostCommentWithViewerData,
} from '../models/post-comment.model';

export interface IPostRepository {
  createPost: (create: CreatePostDto) => Promise<Post>;

  updatePost: (postId: string, update: UpdatePostDto) => Promise<Post | null>;

  deletePost: (postId: string) => Promise<Post | null>;

  getPostById: (postId: string) => Promise<Post | null>;

  getPostWithViewerDataById: (
    postId: string,
    viewerId: string,
  ) => Promise<PostWithViewerData | null>;

  getPostsWithViewerData: (
    filter: any,
    viewerId: string,
  ) => Promise<PostWithViewerData[]>;

  createPostComment: () => Promise<PostComment>;

  getPostCommentById: (postCommentId: string) => Promise<PostComment | null>;

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

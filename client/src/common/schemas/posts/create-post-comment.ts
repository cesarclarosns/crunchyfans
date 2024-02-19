import { z } from 'zod';

export const createPostCommentSchema = z.object({
  content: z.string().min(1),
  postCommentId: z.string().optional(),
  postId: z.string(),
});

export type CreatePostComment = z.infer<typeof createPostCommentSchema>;

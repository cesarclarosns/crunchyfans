import { z } from 'zod';

import { userSchema } from '../users/user';

export const postCommentSchema = z.object({
  _id: z.string().min(1),
  content: z.string(),
  createdAt: z.coerce.date(),
  isLiked: z.boolean(),
  metadata: z.object({
    commentsCount: z.number(),
    likesCount: z.number(),
  }),
  postCommentId: z.string().min(1),
  postId: z.string().min(1),
  user: userSchema,
  userId: z.string().min(1),
});

export type PostComment = z.infer<typeof postCommentSchema>;

import { z } from 'zod';

import { userSchema } from '@/modules/users/schemas/user';

import { mediaSchema } from '../../media/schemas/media';

export const postSchema = z.object({
  _id: z.string().min(1),
  content: z.string(),
  createdAt: z.coerce.date(),
  isLiked: z.boolean(),
  media: z.array(mediaSchema),
  metadata: z.object({
    commentsCount: z.number(),
    likesCount: z.number(),
  }),
  user: userSchema,
  userId: z.string().min(1),
});

export type Post = z.infer<typeof postSchema>;

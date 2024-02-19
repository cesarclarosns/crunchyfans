import { z } from 'zod';

import { mediaSchema } from '../media/media';
import { userSchema } from '../users/user';

export const chatMessageSchema = z.object({
  _id: z.string().min(1),
  content: z.string(),
  createdAt: z.coerce.date(),
  isSeen: z.boolean(),
  media: z.array(mediaSchema),
  user: userSchema,
  userId: z.string().min(1),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

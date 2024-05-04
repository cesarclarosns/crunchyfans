import { z } from 'zod';

import { mediaSchema } from '../../media/schemas/media';
import { userSchema } from '../../users/schemas/user';

export const messageSchema = z.object({
  _id: z.string().min(1),
  chatId: z.string().min(1),
  content: z.string(),
  createdAt: z.coerce.date(),
  media: z.array(mediaSchema),
  seenBy: z.array(z.string()),
  user: userSchema,
  userId: z.string().min(1),
});

export type Message = z.infer<typeof messageSchema>;

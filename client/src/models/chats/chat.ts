import { z } from 'zod';

import { userSchema } from '../users/user';
import { chatMessageSchema } from './chat-message';

export const chatSchema = z.object({
  _id: z.string().min(1),
  message: chatMessageSchema,
  participants: z.array(userSchema),
});

export type Chat = z.infer<typeof chatSchema>;

import { z } from 'zod';

import { userSchema } from '../../users/schemas/user';
import { messageSchema } from './message';

export const chatSchema = z.object({
  _id: z.string().min(1),
  lastMessage: messageSchema,
  participants: z.array(userSchema),
});

export type Chat = z.infer<typeof chatSchema>;

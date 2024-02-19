import { z } from 'zod';

import { chatMessageSchema } from '@/models/chats/chat-message';

export const createChatMessageSchema = z.object({
  chatId: z.string().min(1),
  content: z.string(),
  media: z.array(z.string().min(1)),
});

export type CreateChatMessage = z.infer<typeof createChatMessageSchema>;

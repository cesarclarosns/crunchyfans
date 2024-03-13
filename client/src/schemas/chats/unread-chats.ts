import { z } from 'zod';

export const unreadChatsSchema = z.object({
  count: z.number(),
});

export type UnreadChats = z.infer<typeof unreadChatsSchema>;

import { z } from 'zod';

export const createMessageSchema = z.object({
  chatId: z.string().min(1),
  content: z.string(),
  media: z.array(z.string().min(1)),
});

export type CreateMessage = z.infer<typeof createMessageSchema>;

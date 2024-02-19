import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1),
  media: z.array(z.string()),
});

export type CreatePost = z.infer<typeof createPostSchema>;

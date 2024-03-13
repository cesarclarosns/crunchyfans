import { z } from 'zod';

export const authSchema = z.object({
  accessToken: z.string().min(1),
});

export type Auth = z.infer<typeof authSchema>;

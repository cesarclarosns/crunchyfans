import { z } from 'zod';

export const authSchema = z.object({
  accessToken: z.string(),
});

export type Auth = z.infer<typeof authSchema>;

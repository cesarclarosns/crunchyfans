import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.string(),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

import { z } from 'zod';

export const createFollowerSchema = z.object({
  followeeId: z.string(),
  followerId: z.string(),
});

export type CreateFollower = z.infer<typeof createFollowerSchema>;

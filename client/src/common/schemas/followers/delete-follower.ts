import { z } from 'zod';

export const deleteFollowerSchema = z.object({
  followeeId: z.string(),
  followerId: z.string(),
});

export type DeleteFollower = z.infer<typeof deleteFollowerSchema>;

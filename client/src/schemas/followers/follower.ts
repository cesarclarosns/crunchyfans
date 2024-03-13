import { z } from 'zod';

import { userSchema } from '../users/user';

export const followerSchema = z.object({
  _id: z.string(),
  followee: userSchema,
  followeeId: z.string(),
  follower: userSchema,
  followerId: z.string(),
});

export type Follower = z.infer<typeof followerSchema>;

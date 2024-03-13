import { z } from 'zod';

import { userSchema } from './user';

export const userProfileSchema = userSchema.extend({
  isSubscribed: z.boolean(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

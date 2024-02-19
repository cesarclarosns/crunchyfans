import { z } from 'zod';

import { USER_STATUS } from '@/common/constants/users';

import { mediaSchema } from '../media/media';

export const userSchema = z.object({
  _id: z.string().min(1),
  bio: z.string().min(1).optional(),
  displayName: z.string().min(1),
  email: z.string().email(),
  lastConnection: z.coerce.date().optional(),
  metadata: z
    .object({
      followeesCount: z.number(),
      followersCount: z.number(),
    })
    .optional(),
  pictures: z
    .object({
      coverPicture: mediaSchema.optional(),
      profilePicture: mediaSchema.optional(),
    })
    .optional(),
  settings: z
    .object({
      status: z.enum([USER_STATUS.offline, USER_STATUS.online]),
    })
    .optional(),
  username: z.string().min(1),
});
export type User = z.infer<typeof userSchema>;

/**
 *  Profile
 */

export const userProfileSchema = userSchema
  .omit({
    settings: true,
  })
  .extend({
    isFollowing: z.boolean(),
  });
export type UserProfile = z.infer<typeof userProfileSchema>;

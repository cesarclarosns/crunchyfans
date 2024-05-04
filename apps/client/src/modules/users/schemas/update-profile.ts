import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  displayName: z.string().min(1).optional(),
  pictures: z.object({
    profilePicture: z.string().min(1).optional(),
  }),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

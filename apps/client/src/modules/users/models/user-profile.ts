import { z } from 'zod';

export const userProfileSchema = z.object({});

export type UserProfile = z.infer<typeof userProfileSchema>;

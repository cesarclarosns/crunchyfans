import { z } from 'zod';

export const userStatusSchema = z.enum(['online', 'offline']);

export type UserStatus = z.infer<typeof userStatusSchema>;

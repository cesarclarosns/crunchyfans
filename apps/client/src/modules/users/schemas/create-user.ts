import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email is invalid'),
  name: z.string().min(1, 'Name is too short'),
  password: z
    .string()
    .min(1, 'Password is too short (minimum is 10 characters)'),
  username: z
    .string()
    .min(3, 'Username is too short (minimum is 3 characters)'),
});

export type CreateUser = z.infer<typeof createUserSchema>;

import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(1, 'Password is required'),
});

export type SignIn = z.infer<typeof signInSchema>;

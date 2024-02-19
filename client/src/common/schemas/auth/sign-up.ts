import { type z } from 'zod';

import { createUserSchema } from '../users/create-user';

export const signUpSchema = createUserSchema;

export type SignUp = z.infer<typeof signUpSchema>;

import { type z } from 'zod';

import { signUpSchema } from './sign-up';

export const updatePasswordSchema = signUpSchema.pick({
  password: true,
});

export type UpdatePassword = z.infer<typeof updatePasswordSchema>;

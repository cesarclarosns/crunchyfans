import { type z } from 'zod';

import { signUpSchema } from './sign-up';

export const resetPasswordSchema = signUpSchema.pick({
  email: true,
});

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

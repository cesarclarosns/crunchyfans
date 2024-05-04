import { type z } from 'zod';

import { createUserSchema } from './create-user';

export const updateUserSchema = createUserSchema.partial();

export type UpdateUser = z.infer<typeof updateUserSchema>;

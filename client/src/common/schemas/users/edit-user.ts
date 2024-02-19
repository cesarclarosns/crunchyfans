import { type z } from 'zod';

import { createUserSchema } from './create-user';

export const editUserSchema = createUserSchema.partial().extend({});

export type EditUser = z.infer<typeof editUserSchema>;

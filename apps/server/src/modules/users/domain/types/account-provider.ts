import { z } from 'zod';

export const accountProviderSchema = z.enum(['google', 'apple', 'facebook']);

export type AccountProvider = z.infer<typeof accountProviderSchema>;

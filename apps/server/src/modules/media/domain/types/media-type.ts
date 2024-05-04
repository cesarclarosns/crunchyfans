import { z } from 'zod';

export const mediaTypeSchema = z.enum(['audio', 'image', 'video']);

export type MediaType = z.infer<typeof mediaTypeSchema>;

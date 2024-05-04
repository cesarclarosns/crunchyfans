import { z } from 'zod';

export const transcodingStatusSchema = z.enum([
  'submitted',
  'complete',
  'error',
]);

export type TranscodingStatus = z.infer<typeof transcodingStatusSchema>;

import { z } from 'zod';

export const transcodingStatusSchema = z.enum([
  'submitted',
  'completed',
  'failed',
]);

export type TranscodingStatus = z.infer<typeof transcodingStatusSchema>;

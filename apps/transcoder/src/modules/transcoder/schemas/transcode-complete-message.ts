import { z } from 'zod';

export const transcodeCompleteMessageSchema = z.object({
  metadata: z.record(z.string()),
  outputs: z.object({
    info: z.object({
      duration: z.string().optional(),
      height: z.string().optional(),
      width: z.string().optional(),
    }),
    preview: z.string().optional(),
    source: z.string().optional(),
    sources: z.record(z.string()).optional(),
    thumbnail: z.string().optional(),
  }),
});

export type TranscodeCompleteMessage = z.infer<
  typeof transcodeCompleteMessageSchema
>;

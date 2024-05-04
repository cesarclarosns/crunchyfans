import { z } from 'zod';

export const transcodeSubmitMessageSchema = z.object({
  fileKey: z.string(),
  metadata: z.record(z.string()),
  options: z.object({
    needsPreview: z.boolean().optional(),
    needsThumbnail: z.boolean(),
    needsWatermark: z.boolean(),
    watermarkText: z.string().optional(),
  }),
});

export type TranscodeSubmitMessage = z.infer<
  typeof transcodeSubmitMessageSchema
>;

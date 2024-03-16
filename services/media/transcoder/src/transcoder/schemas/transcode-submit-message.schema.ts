import { z } from 'zod';

export const transcodeSubmitMessageSchema = z.object({
  fileKey: z.string(),
  mediaId: z.string(),
  options: z.object({
    needsThumbnail: z.boolean(),
    needsWatermark: z.boolean(),
    watermarkText: z.string().optional(),
  }),
});

export type TranscodeSubmitMessage = z.infer<
  typeof transcodeSubmitMessageSchema
>;

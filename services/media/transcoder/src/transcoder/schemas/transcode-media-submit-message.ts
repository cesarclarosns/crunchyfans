import { z } from 'zod';

export const transcodeMediaSubmitMessageSchema = z.object({
  fileKey: z.string(),
  mediaId: z.string(),
  mediaType: z.enum(['image', 'video']),
  options: z.object({
    needsThumbnails: z.boolean(),
    needsWatermark: z.boolean(),
    watermarkPosition: z.enum([
      'top',
      'top-left',
      'top-right',
      'center',
      'bottom',
      'bottom-left',
      'bottom-right',
    ]),
    watermarkText: z.string(),
  }),
});

export type TranscodeMediaSubmitMessage = z.infer<
  typeof transcodeMediaSubmitMessageSchema
>;

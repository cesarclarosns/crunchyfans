import { z } from 'zod';

export const createMediaSchema = z.object({
  fileKey: z.string(),
  options: z.object({
    needsThumbnail: z.boolean(),
    needsWatermark: z.boolean(),
    watermarkText: z.string(),
  }),
});

export type CreateMedia = z.infer<typeof createMediaSchema>;

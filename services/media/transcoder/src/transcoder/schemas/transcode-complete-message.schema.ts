import { z } from 'zod';

export const sourceSchema = z.object({
  duration: z.string().optional(),
  fileKey: z.string(),
  quality: z.string(),
});

export type Source = z.infer<typeof sourceSchema>;

export const transcodeCompleteMessageSchema = z.object({
  mediaId: z.string(),
  sources: z.array(sourceSchema),
  thumbnails: z.array(sourceSchema),
});

export type TranscodeCompleteMessage = z.infer<
  typeof transcodeCompleteMessageSchema
>;

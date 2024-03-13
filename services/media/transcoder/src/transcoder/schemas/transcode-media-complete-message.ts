import { z } from 'zod';

export const transcodeMediaCompleteMessageSchema = z.object({
  sources: z.array(
    z.object({
      duration: z.string().optional(),
      fileKey: z.string(),
      quality: z.string(),
    }),
  ),
  thumbnails: z.array(z.object({ fileKey: z.string(), quality: z.string() })),
});

export type TranscodeMediaCompleteMessage = z.infer<
  typeof transcodeMediaCompleteMessageSchema
>;

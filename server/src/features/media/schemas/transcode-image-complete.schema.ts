import { z } from 'zod';

export const transcodeImageCompleteMessageBodySchema = z.object({
  mediaId: z.string(),
  qualities: z.array(
    z.object({
      fileKey: z.string().min(1),
      quality: z.string().min(1),
    }),
  ),
});

export type TranscodeImageJobCompleteMessageBody = z.infer<
  typeof transcodeImageCompleteMessageBodySchema
>;

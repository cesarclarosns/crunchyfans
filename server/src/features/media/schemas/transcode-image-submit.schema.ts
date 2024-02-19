import { z } from 'zod';

export const transcodeImageSubmitMessageBodySchema = z.object({
  fileKey: z.string(),
  mediaId: z.string(),
});

export type TranscodeImageSubmitMessageBody = z.infer<
  typeof transcodeImageSubmitMessageBodySchema
>;

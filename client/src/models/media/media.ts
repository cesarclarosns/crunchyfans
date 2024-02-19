import { z } from 'zod';

import { MEDIA_TYPE } from '@/common/constants/media';

export const mediaSchema = z.object({
  _id: z.string().min(1),
  mediaType: z.enum([MEDIA_TYPE.audio, MEDIA_TYPE.image, MEDIA_TYPE.video]),
  processing: z.object({
    fileKey: z.string(),
    transcodingStatus: z.enum(['submit', 'complete', 'error']),
  }),
  sources: z.array(
    z.object({
      fileKey: z.string(),
      fileUrl: z.string(),
      quality: z.string(),
    }),
  ),
  thumbnails: z.array(
    z.object({
      fileKey: z.string(),
      fileUrl: z.string(),
    }),
  ),
  userId: z.string().min(1),
});
export type Media = z.infer<typeof mediaSchema>;

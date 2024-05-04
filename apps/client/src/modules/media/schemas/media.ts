import { z } from 'zod';

import { MEDIA_TYPE } from '@/common/constants/media';

export const mediaSchema = z.object({
  id: z.string(),
  preview: z.string(),
  source: z.string(),
  sources: z.record(z.string()),
  thumbnail: z.string(),
  transcodingStatus: z.enum(['submit', 'complete', 'error']),
  type: z.enum([MEDIA_TYPE.audio, MEDIA_TYPE.image, MEDIA_TYPE.video]),
  userId: z.string().min(1),
});

export type Media = z.infer<typeof mediaSchema>;

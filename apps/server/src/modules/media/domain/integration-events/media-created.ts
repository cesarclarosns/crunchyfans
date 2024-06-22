import { z } from 'zod';

import { mediaTypeSchema } from '@/modules/media/domain/types/media-type';

export const mediaCreatedSchema = z.object({
  fileKey: z.string(),
  id: z.string(),
  needsPreview: z.boolean(),
  needsThumbnail: z.boolean(),
  needsWatermark: z.boolean(),
  type: mediaTypeSchema,
});

export type MediaCreated = z.infer<typeof mediaCreatedSchema>;

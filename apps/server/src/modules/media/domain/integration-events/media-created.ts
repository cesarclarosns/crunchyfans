import { z } from 'zod';

import { MediaType } from '../types/media-type';

export const mediaCreatedSchema = z.object({ mediaId: z.string() });

export type MediaCreated = {
  mediaId: string;
  type: MediaType;
  processing: {
    fileKey: string;
    needsThumbnail: boolean;
    needsPreview: boolean;
    needsWatermark: boolean;
  };
};

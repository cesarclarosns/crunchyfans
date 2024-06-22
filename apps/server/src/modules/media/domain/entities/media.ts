import { MediaType } from '../types/media-type';

export class Media {
  id: string;
  userId: string;
  type: MediaType;
  source: string;
  thubmnail: string;
  preview: string;
  sources: Record<string, string>;
  isReady: boolean;
  hasError: boolean;
  fileKey: string;
  needsThumbnail: boolean;
  needsPreview: boolean;
  needsWatermark: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(entity: Media) {
    Object.assign(entity, this);
  }
}

import { MediaType } from '../types/media-type';

export class Media {
  id: string;
  userId: string;
  type: MediaType;
  source: string;
  thubmnail: string;
  preview: string;
  sources: Record<string, string>;
  processing: {
    fileKey: string;
    needsThumbnail: boolean;
    needsPreview: boolean;
    needsWatermark: boolean;
  };
  isReady: boolean;
  hasError: boolean;

  constructor(model: Media) {
    Object.assign(model, this);
  }
}

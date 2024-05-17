import { IModel } from '@/common/domain/model';

import { MediaType } from '../types/media-type';

export class Media implements IModel {
  id: string;
  userId: string;
  type: MediaType;
  processing: {
    fileKey: string;
    needsThumbnail: boolean;
    needsPreview: boolean;
    needsWatermark: boolean;
  };
  sources: Record<string, string>;
  source: string;
  thubmnail: string;
  preview: string;
  isReady: boolean;
  hasError: boolean;

  constructor(model: Media) {
    Object.assign(model, this);
  }

  toDto() {}
}

import { Media } from '../models/media.model';

export interface IMediaService {
  createMedia: () => Promise<Media>;

  updateMedia: () => Promise<Media | null>;

  prepareMedia: () => Promise<Media>;
}

export const IMediaService = Symbol('IMediaService');

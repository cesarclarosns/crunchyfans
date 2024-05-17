import { MediaType } from '../types/media-type';

export class MediaDto {
  id: string;
  type: MediaType;
  sources: Record<string, string>;
  source: string;
  preview: string;
  thumbnail: string;
  isReady: boolean;
  hasError: boolean;

  constructor({ ...partial }: Partial<MediaDto>) {
    Object.assign(this, partial);
  }
}

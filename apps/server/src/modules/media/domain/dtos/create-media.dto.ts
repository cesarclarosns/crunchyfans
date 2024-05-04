import { MediaType } from '../types/media-type';
import { TranscodingStatus } from '../types/transcoding-status';

export class CreateMediaDto {
  userId: string;
  type: MediaType;
  sources: Record<string, string>;
  source: string;
  preview: string;
  thumbnail: string;
  transcodingStatus: TranscodingStatus;

  constructor(partial: Partial<CreateMediaDto>) {
    Object.assign(this, partial);
  }
}

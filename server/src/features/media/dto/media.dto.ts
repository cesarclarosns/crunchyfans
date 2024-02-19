import { ObjectValues } from '@/common/types/object-values.type';

import {
  MEDIA_TYPE,
  PROCESSING_STATUS,
  TRANSCODING_STATUS,
} from '../media.constants';

export class ThumbnailDto {
  fileKey: string;
  fileUrl: string;
}

export class SourceDto {
  quality: string;
  fileKey: string;
  fileUrl: string;
}

export class ProcessingDto {
  transcodingStatus: ObjectValues<typeof TRANSCODING_STATUS>;
  fileKey: string;
}

export class MediaDto {
  _id: string;
  mediaType: ObjectValues<typeof MEDIA_TYPE>;
  userId: string;
  processing: ProcessingDto;

  sources: SourceDto[];
  thumbnails: ThumbnailDto[];
}

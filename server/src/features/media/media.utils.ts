import { BadRequestException } from '@nestjs/common';

import { ObjectValues } from '@/common/types/object-values.type';

import {
  AUDIO_FORMAT,
  IMAGE_FORMAT,
  MEDIA_TYPE,
  VIDEO_FORMAT,
} from './media.constants';

export function getMediaTypeFromFileName(
  fileName: string,
): ObjectValues<typeof MEDIA_TYPE> {
  const fileFormat = getFileFormatFromFileName(fileName) as any;

  if (Object.values(AUDIO_FORMAT).includes(fileFormat)) {
    return 'audio';
  } else if (Object.values(IMAGE_FORMAT).includes(fileFormat)) {
    return 'image';
  } else if (Object.values(VIDEO_FORMAT).includes(fileFormat)) {
    return 'video';
  } else {
    throw new BadRequestException('Invalid mediaType');
  }
}

export function getFileFormatFromFileName(fileName: string) {
  return fileName.split('.').at(-1) as any;
}

import { BadRequestException } from '@nestjs/common';

import { ObjectValues } from '@/common/types/object-values.type';

import {
  AUDIO_FORMAT,
  IMAGE_FORMAT,
  MEDIA_TYPE,
  VIDEO_FORMAT,
} from './media.constants';

export function getMediaTypeFromFileKey(
  fileKey: string,
): ObjectValues<typeof MEDIA_TYPE> {
  const fileName = getFileNameFromFileKey(fileKey);
  const fileExtension = fileName.split('.').at(-1) as any;

  if (Object.values(AUDIO_FORMAT).includes(fileExtension)) {
    return 'audio';
  } else if (Object.values(IMAGE_FORMAT).includes(fileExtension)) {
    return 'image';
  } else if (Object.values(VIDEO_FORMAT).includes(fileExtension)) {
    return 'video';
  } else {
    throw new BadRequestException('Invalid mediaType');
  }
}

export function getFileNameFromFileKey(fileKey: string) {
  return fileKey.split('/').at(-1)!;
}

import {
  AUDIO_FILE_TYPE,
  FILE_TYPE,
  IMAGE_FILE_TYPE,
  type MEDIA_TYPE,
  VIDEO_FILE_TYPE,
} from '@/common/constants/media';
import { type ObjectValues } from '@/common/types/object-values';

export function megabytesToBytes(megabytes: number): number {
  return megabytes * 1_048_576;
}

export function getNumberOfParts(fileSize: number, chunkSize: number) {
  return Math.ceil(fileSize / chunkSize);
}

export function getChunkSize(fileSize: number) {
  if (fileSize > megabytesToBytes(25)) {
    return megabytesToBytes(25);
  } else {
    return megabytesToBytes(5);
  }
}

export function getFilePart(file: File, partNumber: number, chunkSize: number) {
  if (partNumber < 1) throw new Error('partNumber must be greater than 1');

  const numberOfParts = getNumberOfParts(file.size, chunkSize);

  let start = (partNumber - 1) * chunkSize;
  let end = partNumber * chunkSize;
  if (partNumber == numberOfParts) end += 1;

  return file.slice(start, end);
}

export function getFileExtension(file: File) {
  return file.name.split('.').at(-1)!.toLowerCase();
}

export function getFileKey(file: File, userId: string) {
  const id = crypto.randomUUID();
  const fileExtension = getFileExtension(file);
  return `uploads/${userId}/${id}/${id}.${fileExtension}`;
}

export function getFileTypeFromFileName(
  fileName: string,
): ObjectValues<typeof FILE_TYPE> {
  const fileType = fileName.split('.').at(-1)?.toLowerCase() as any;

  if (Object.values(FILE_TYPE).includes(fileType)) {
    return fileType;
  } else {
    throw new Error('Invalid fileType');
  }
}

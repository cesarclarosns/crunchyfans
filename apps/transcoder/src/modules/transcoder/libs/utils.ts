import { AudioFormat } from '../types/audio-format';
import { ImageFormat } from '../types/image-format';
import { MediaType } from '../types/media-type';
import { VideoFormat } from '../types/video-format';

export function getDirFromFileKey(fileKey: string): string {
  return fileKey.split('/').slice(0, -1).join('/');
}

export function getFileNameFromFilePath(filePath: string): string {
  return filePath.split('/').at(-1)!;
}

export function getFileNameFromFileKey(fileKey: string): string {
  return fileKey.split('/').at(-1)!;
}

export function getMediaTypeFromFileKey(fileKey: string): MediaType {
  const fileName = getFileNameFromFileKey(fileKey);
  const fileExtension = fileName.split('.').at(-1)! as any;

  const audioFormats: AudioFormat[] = ['mp3', 'ogg', 'wav'];
  const imageFormats: ImageFormat[] = ['gif', 'jpeg', 'jpg', 'png'];
  const videoFormats: VideoFormat[] = [
    'avi',
    'm4v',
    'mkv',
    'moov',
    'mov',
    'mp4',
    'mpeg',
    'mpeg',
    'mpg',
    'webm',
    'wmv',
  ];

  if (audioFormats.includes(fileExtension)) return 'audio';
  if (imageFormats.includes(fileExtension)) return 'image';
  if (videoFormats.includes(fileExtension)) return 'video';
  return 'document';
}

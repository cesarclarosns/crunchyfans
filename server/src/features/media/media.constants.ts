export const MEDIA_TYPE = {
  audio: 'audio',
  image: 'image',
  video: 'video',
} as const;

export const AUDIO_FORMAT = {
  mp3: 'mp3',
  ogg: 'ogg',
  wav: 'wav',
} as const;

export const IMAGE_FORMAT = {
  gif: 'gif',
  jpeg: 'jpeg',
  jpg: 'jpg',
  png: 'png',
} as const;

export const VIDEO_FORMAT = {
  avi: 'avi',
  m4v: 'm4v',
  mkv: 'mkv',
  moov: 'moov',
  mov: 'mov',
  mp4: 'mp4',
  mpeg: 'mpeg',
  mpg: 'mpg',
  webm: 'webm',
  wmv: 'wmv',
} as const;

export const FILE_FORMAT = {
  ...AUDIO_FORMAT,
  ...IMAGE_FORMAT,
  ...VIDEO_FORMAT,
} as const;

export const AUDIO_FORMAT_QUALITY = {
  original: 'original',
} as const;

export const IMAGE_FORMAT_QUALITY = {
  '150': '128',
  '32': '32',
  '512': '512',
  original: 'original',
  thumbnail: 'thumbnail',
} as const;

export const VIDEO_FORMAT_QUALITY = {
  '240p': '240p',
  '720p': '720p',
  original: 'original',
} as const;

export const FORMAT_QUALITY = {
  ...AUDIO_FORMAT_QUALITY,
  ...IMAGE_FORMAT_QUALITY,
  ...VIDEO_FORMAT_QUALITY,
} as const;

export const PROCESSING_STATUS = {
  complete: 'complete',
  error: 'error',
  submit: 'submit',
} as const;

export const TRANSCODING_STATUS = {
  complete: 'complete',
  error: 'error',
  submit: 'submit',
} as const;

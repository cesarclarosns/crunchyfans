export const MEDIA_TYPE = {
  audio: 'audio',
  image: 'image',
  video: 'video',
} as const;

export const PROCESSING_STATUS = {
  complete: 'complete',
  error: 'error',
  submit: 'submit',
} as const;

export const AUDIO_FILE_TYPE = {
  mp3: 'mp3',
  ogg: 'ogg',
  wav: 'wav',
} as const;

export const IMAGE_FILE_TYPE = {
  gif: 'gif',
  jpeg: 'jpeg',
  jpg: 'jpg',
  png: 'png',
} as const;

export const VIDEO_FILE_TYPE = {
  m4v: 'm4v',
  mov: 'mov',
  mp4: 'mp4',
} as const;

export const FILE_TYPE = {
  ...AUDIO_FILE_TYPE,
  ...IMAGE_FILE_TYPE,
  ...VIDEO_FILE_TYPE,
} as const;

export const AUDIO_FORMAT_QUALITY_NAME = {
  original: 'original',
} as const;

export const IMAGE_FORMAT_QUALITY_NAME = {
  high: 'high',
  low: 'low',
  normal: 'normal',
  original: 'original',
  thumbnail: 'thumbnail',
} as const;

export const VIDEO_FORMAT_QUALITY_NAME = {
  '1080p': '1080p',
  '480p': '480p',
  '720p': '720p',
  original: 'original',
} as const;

export const FORMAT_QUALITY_NAME = {
  ...AUDIO_FORMAT_QUALITY_NAME,
  ...IMAGE_FORMAT_QUALITY_NAME,
  ...VIDEO_FORMAT_QUALITY_NAME,
} as const;

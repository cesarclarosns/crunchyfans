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

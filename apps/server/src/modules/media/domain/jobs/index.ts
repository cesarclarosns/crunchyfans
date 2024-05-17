export * from './process-media.job';
export * from './transcode-media.job';

export const MEDIA_JOBS = {
  processMedia: 'media.processMedia',
  transcodeMedia: 'media.transcodeMedia',
} as const;

import { MediaType } from '../types/media-type';

export class TranscodeMediaJob {
  type: MediaType;
  fileKey: string;
  needsWatermark: boolean;
  needsThumbnail: boolean;
  needsPreview: boolean;

  constructor(job: TranscodeMediaJob) {
    Object.assign(this, job);
  }
}

export class TranscodeMediaResult {
  sources: Record<string, string>;
  source: string;
  thumbnail: string;
  preview: string;
  isReady: boolean;
  hasError: boolean;
}

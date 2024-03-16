import { TranscodeSubmitMessage } from '../schemas/transcode-submit-message.schema';

export type FileSource = {
  filePath: string;
  quality: string;
  duration?: string;
};

export type TranscodeHandler = (
  filePath: string,
  dir: string,
  options: TranscodeSubmitMessage['options'],
) => Promise<{
  sources: FileSource[];
  thumbnails: FileSource[];
}>;

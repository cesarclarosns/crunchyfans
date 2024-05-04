import { TranscodeCompleteMessage } from '../schemas/transcode-complete-message';
import { TranscodeSubmitMessage } from '../schemas/transcode-submit-message';

export type TranscodeHandler = (
  fileKey: string,
  folder: string,
  options: TranscodeSubmitMessage['options'],
) => Promise<TranscodeCompleteMessage['outputs']>;

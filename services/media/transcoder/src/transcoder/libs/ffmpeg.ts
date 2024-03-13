import ffmpeg from 'fluent-ffmpeg';

import {
  type TranscodeMediaSubmit,
  transcodeMediaSubmitSchema,
} from '../../schemas/transcode-media-submit-message';

export function ffprobe(filePath: string) {
  return new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function run(command: ffmpeg.FfmpegCommand) {
  return new Promise<void>((resolve, reject) => {
    command.on('start', (cmd) => {
      console.log('start', cmd);
    });
    command.on('end', () => {
      console.log('end');
      resolve();
    });
    command.on('error', (err) => {
      console.log('error', err);
      reject(err);
    });
    command.on('progress', (progress) => {
      console.log('Processing: ' + progress.percent + '% done');
    });
    command.run();
  });
}

export const watermarkPositionMap = new Map<
  TranscodeMediaSubmit['options']['watermarkPosition'],
  string
>([
  ['top-left', 'x=20: y=20'],
  ['top', 'x=(w-tw)/2: y=20'],
  ['top-right', 'x=w-tw-20: y=20'],
  ['center', 'x=(w-tw)/2: y=(h-th)/2'],
  ['bottom-left', 'x=20: y=h-th-20'],
  ['bottom', 'x=(w-tw)/2: y=h-th-20'],
  ['bottom-right', 'x=w-tw-20: y=h-th-20'],
]);

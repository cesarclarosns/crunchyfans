import ffmpeg from 'fluent-ffmpeg';

import { FileSource } from '../types/transcode-handler.type';

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

export async function createThumbnails(
  filePath: string,
  dir: string,
  timestamps: string[],
  height: number,
): Promise<FileSource[]> {
  const thumbnails = await new Promise<FileSource[]>((resolve, reject) => {
    const thumbnails: FileSource[] = [];

    ffmpeg(filePath)
      .thumbnails({
        filename: `thumbnail_at_%ss.png`,
        folder: dir,
        size: `?x${height}`,
        timestamps,
      })
      .on('start', (cmd) => {
        console.log('start', cmd);
      })
      .on('filenames', (filenames: string[]) => {
        console.log('filenames', filenames);
        for (const filename of filenames) {
          thumbnails.push({
            filePath: `${dir}/${filename}`,
            quality: `${height}`,
          });
        }
      })
      .on('end', () => {
        console.log('end');
        resolve(thumbnails);
      })
      .on('error', (err) => {
        console.log('err');
        reject(err);
      });
  });

  return thumbnails;
}

export const WATERMARK_POSITION = {
  bottom: 'x=(w-tw)/2: y=h-th-20',
  'bottom-left': 'x=20: y=h-th-20',
  'bottom-right': 'x=w-tw-20: y=h-th-20',
  center: 'x=(w-tw)/2: y=(h-th)/2',
  top: 'x=(w-tw)/2: y=20',
  'top-left': 'x=20: y=20',
  'top-right': 'x=w-tw-20: y=20',
} as const;

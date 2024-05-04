import ffmpeg from 'fluent-ffmpeg';

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
    command
      .on('start', (cmd) => {
        console.log('start', cmd);
      })
      .on('end', () => {
        console.log('end');
        resolve();
      })
      .on('error', (err) => {
        console.log('error', err);
        reject(err);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      });

    command.run();
  });
}

export async function createImageThumbnail({
  filePath,
  folder,
  height,
}: {
  filePath: string;
  folder: string;
  height: number;
}): Promise<string> {
  console.log(filePath, folder, height);
  return '';
}

export async function createVideoThumbnail({
  filePath,
  folder,
  timestamp,
  height,
}: {
  filePath: string;
  folder: string;
  timestamp: string;
  height: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    let thumbnails: string[] = [];

    ffmpeg(filePath)
      .thumbnails({
        filename: `thumbnail_at_%s.png`,
        folder: folder,
        size: `?x${height}`,
        timestamps: [timestamp],
      })
      .on('start', (cmd) => {})
      .on('filenames', (filenames: string[]) => {
        thumbnails = filenames.map((filename) => `${folder}/${filename}`);
      })
      .on('end', () => {
        const thumbnail = thumbnails[0];

        if (thumbnail) {
          resolve(thumbnail);
        } else {
          reject();
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
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

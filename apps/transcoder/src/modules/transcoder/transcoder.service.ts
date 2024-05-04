import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  createThumbnails,
  ffprobe,
  run,
  WATERMARK_POSITION,
} from './libs/ffmpeg';
import {
  TranscodeMediaCompleteMessage,
  transcodeMediaCompleteMessageSchema,
} from './schemas/transcode-complete-message';
import { FileSource, TranscodeHandler } from './types/transcode-handler';

@Injectable()
export class TranscoderService {
  constructor(
    @InjectPinoLogger(TranscoderService.name)
    private readonly logger: PinoLogger,
  ) {}

  transcodeImage: TranscodeHandler = async (filePath, folder, options) => {
    this.logger.trace('transcodeImage');

    const outputs: TranscodeMediaCompleteMessage['outputs'] = { info: {} };
    return outputs;

    const THUMBNAIL_HEIGHT = 300;
    const SOURCE_MAX_HEIGHT = 1080;
    const SOURCE_HEIGHTS = [600];

    const fileName = filePath.split('/').at(-1);

    // Get metadata
    const metadata = await ffprobe(filePath);

    const imageHeight = metadata.streams[0].height;

    if (!imageHeight) throw new Error('Cannot read image metadata');

    // Create sources
    const sources: FileSource[] = [];

    let heights = Array.from(
      new Set([
        ...(options.needsThumbnail ? [THUMBNAIL_HEIGHT] : []),
        ...SOURCE_HEIGHTS,
        Math.min(imageHeight, SOURCE_MAX_HEIGHT),
      ]),
    );
    heights = heights.filter((height) => height <= imageHeight);

    const command = ffmpeg(filePath);

    if (options.needsWatermark) {
      const watermarkText = options.watermarkText;
      const watermarkPosition = WATERMARK_POSITION['bottom-right'];

      command.complexFilter([
        {
          filter: 'drawtext',
          inputs: ['0'],
          options: `fontsize=(h/30): ${watermarkPosition}: text='${watermarkText}': fontfile=/Windows/Fonts/arial.ttf: fontcolor=white@0.7`,
          outputs: ['[watermarked]'],
        },
        {
          filter: 'split',
          inputs: ['[watermarked]'],
          options: `${heights.length}`,
          outputs: heights.map((height) => `[watermarked_${height}]`),
        },
        ...heights.map((height) => ({
          filter: 'scale',
          inputs: [`[watermarked_${height}]`],
          options: `-1:${height}`,
          outputs: [`[output_${height}]`],
        })),
      ]);
    } else {
      command.complexFilter([
        {
          filter: 'split',
          inputs: ['0'],
          options: `${heights.length}`,
          outputs: heights.map((height) => `[source_${height}]`),
        },
        ...heights.map((height) => ({
          filter: 'scale',
          inputs: [`[source_${height}]`],
          options: `-1:${height}`,
          outputs: [`[output_${height}]`],
        })),
      ]);
    }

    for (const height of heights) {
      const filePath = `${dir}/${height}_${fileName}`;
      sources.push({ filePath, quality: `${height}` });

      command.output(filePath).map(`[output_${height}]`);
    }

    await run(command);

    this.logger.trace('trancodeImage done');

    return { sources, thumbnails: [] };
  };

  transcodeVideo: TranscodeHandler = async (filePath, dir, options) => {
    this.logger.trace('transcodeVideo');

    const THUMBNAIL_HEIGHT = 720;
    const SOURCE_MAX_HEIGHT = 1080;
    const SOURCE_HEIGHTS = [240, 720];

    const fileName = filePath.split('/').at(-1)!;

    const metadata = await ffprobe(filePath);

    const videoHeight = metadata.streams[0].height;
    const videoDuration = `${metadata.streams[0].duration}`;

    if (!videoHeight || !videoDuration)
      throw new Error('Cannot read video metadata');

    // Define heights
    let heights = Array.from(
      new Set([...SOURCE_HEIGHTS, Math.min(videoHeight, SOURCE_MAX_HEIGHT)]),
    );
    heights = heights.filter((height) => height <= videoHeight);

    // Create sources
    const sources: FileSource[] = [];

    const command = ffmpeg(filePath);

    if (options.needsWatermark) {
      const watermarkText = options.watermarkText ?? 'crunchyfans.com';
      const watermarkPosition = WATERMARK_POSITION['bottom-right'];

      command.complexFilter([
        {
          filter: 'drawtext',
          inputs: ['0'],
          options: `fontsize=(h/30): ${watermarkPosition}: text='${watermarkText}': fontfile=/Windows/Fonts/arial.ttf: fontcolor=white@0.7`,
          outputs: ['[watermarked]'],
        },
        {
          filter: 'split',
          inputs: ['[watermarked]'],
          options: `${heights.length}`,
          outputs: heights.map((height) => `[watermarked_${height}]`),
        },
        ...heights.map((height) => ({
          filter: 'scale',
          inputs: [`[watermarked_${height}]`],
          options: `w=trunc(oh*a/2)*2: h=${height}`,
          outputs: [`[output_${height}]`],
        })),
      ]);
    } else {
      command.complexFilter([
        {
          filter: 'split',
          inputs: ['0'],
          options: `${heights.length}`,
          outputs: heights.map((height) => {
            return `[source_${height}]`;
          }),
        },
        ...heights.map((height) => {
          return {
            filter: 'scale',
            inputs: [`[source_${height}]`],
            options: `w=trunc(oh*a/2)*2: h=${height}`,
            outputs: [`[output_${height}]`],
          };
        }),
      ]);
    }

    for (const height of heights) {
      const filePath = `${dir}/${height}_${fileName}`;
      sources.push({
        duration: videoDuration,
        filePath,
        quality: `${height}`,
      });

      command.output(filePath).map(`[output_${height}]`);
    }

    await run(command);

    // Create thumbnails
    const thumbnails = await createThumbnails(
      filePath,
      dir,
      ['0%'],
      Math.min(THUMBNAIL_HEIGHT, videoHeight),
    );

    this.logger.trace('transcodeVideo done');

    return { sources, thumbnails };
  };
}

import { randomUUID } from 'node:crypto';
import os, { tmpdir } from 'node:os';
import path from 'node:path';

import { Message } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import fs from 'fs-extra';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { config } from '@/config';

import {
  getDirFromFileKey,
  getFileNameFromFileKey,
  getMediaTypeFromFileKey,
} from '../libs/utils';
import { TranscodeCompleteProducer } from '../producers/transcode-complete.producer';
import { Source } from '../schemas/transcode-complete-message.schema';
import { transcodeSubmitMessageSchema } from '../schemas/transcode-submit-message.schema';
import { StorageService } from '../storage.service';
import { TranscoderService } from '../transcoder.service';
import { TranscodeHandler } from '../types/transcode-handler.type';

@Injectable()
export class TranscodeSubmitConsumer {
  constructor(
    @InjectPinoLogger(TranscodeSubmitConsumer.name)
    private readonly logger: PinoLogger,
    private readonly storageService: StorageService,
    private readonly transcoderService: TranscoderService,
    private readonly transcodeCompleteProducer: TranscodeCompleteProducer,
  ) {}

  @SqsMessageHandler(config.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME)
  async handleMessage(message: Message) {
    this.logger.trace(message, 'handleMessage');

    const tmpdir = path.join(os.tmpdir(), randomUUID());
    await fs.mkdirs(tmpdir);

    try {
      const body = transcodeSubmitMessageSchema.parse(
        JSON.parse(message.Body!),
      );

      const mediaType = getMediaTypeFromFileKey(body.fileKey);

      // Download
      const filePath = await this.storageService.download({
        bucket: config.S3_BUCKET_MEDIA_PROCESSING,
        dir: tmpdir,
        fileKey: body.fileKey,
      });

      // Transcode
      const sources: Source[] = [];
      const thumbnails: Source[] = [];

      const pendingUploads: { fileKey: string; filePath: string }[] = [];

      if (mediaType === 'image' || mediaType === 'video') {
        let result: Awaited<ReturnType<TranscodeHandler>>;

        if (mediaType === 'image') {
          result = await this.transcoderService.transcodeImage(
            filePath,
            tmpdir,
            body.options,
          );
        } else {
          result = await this.transcoderService.transcodeVideo(
            filePath,
            tmpdir,
            body.options,
          );
        }

        for (const source of result.sources) {
          const dir = getDirFromFileKey(body.fileKey);
          const fileName = `src_${source.quality}_${getFileNameFromFileKey(body.fileKey)}`;
          const fileKey = `${dir}/${fileName}`;

          sources.push({
            fileKey,
            quality: source.quality,
            ...(!!source.duration ? { duration: source.duration } : {}),
          });
          pendingUploads.push({ fileKey, filePath: source.filePath });
        }
        for (const thumbnail of result.thumbnails) {
          const dir = getDirFromFileKey(body.fileKey);
          const fileName = `src_${thumbnail.quality}_${getFileNameFromFileKey(body.fileKey)}`;
          const fileKey = `${dir}/${fileName}`;

          thumbnails.push({
            fileKey,
            quality: thumbnail.quality,
            ...(!!thumbnail.duration ? { duration: thumbnail.duration } : {}),
          });
          pendingUploads.push({ fileKey, filePath: thumbnail.filePath });
        }
      } else {
        sources.push({ fileKey: body.fileKey, quality: 'original' });
        pendingUploads.push({ fileKey: body.fileKey, filePath });
      }

      // Upload
      await Promise.all(
        pendingUploads.map(async ({ fileKey, filePath }) => {
          const fileReadStream = fs.createReadStream(filePath);

          await this.storageService.upload({
            body: fileReadStream,
            bucket: config.S3_BUCKET_MEDIA,
            fileKey: fileKey,
          });
        }),
      );

      // Clean up

      // Complete
      await this.transcodeCompleteProducer.send({
        mediaId: body.mediaId,
        sources,
        thumbnails,
      });

      this.logger.trace('handleMessage done');
    } finally {
      await fs.remove(tmpdir);
    }
  }

  @SqsConsumerEventHandler(
    config.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME,
    'error',
  )
  async handleError(error: Error) {
    this.logger.error(error, 'handleError');
  }

  @SqsConsumerEventHandler(
    config.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME,
    'processing_error',
  )
  async handleProcessingError(error: Error) {
    this.logger.error(error, 'handleProcessingError');
  }
}

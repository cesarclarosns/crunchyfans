import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { config } from '@/config';
import {
  TranscodeCompleteMessage,
  transcodeCompleteMessageSchema,
} from '@/transcoder/schemas/transcode-complete-message.schema';

@Injectable()
export class TranscodeCompleteProducer {
  constructor(
    @InjectPinoLogger(TranscodeCompleteProducer.name)
    private readonly logger: PinoLogger,
    private readonly sqsService: SqsService,
  ) {}

  async send(message: TranscodeCompleteMessage) {
    this.logger.trace('send');

    const body = JSON.stringify(transcodeCompleteMessageSchema.parse(message));
    const id = randomUUID();

    await this.sqsService.send(config.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME, {
      body,
      id,
    });

    this.logger.trace('send done');
  }
}

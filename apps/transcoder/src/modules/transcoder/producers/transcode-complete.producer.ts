import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { settings } from '@/config/settings';
import {
  TranscodeCompleteMessage,
  transcodeCompleteMessageSchema,
} from '@/modules/transcoder/schemas/transcode-complete-message';

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

    await this.sqsService.send(
      settings.TRANSCODER.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME,
      {
        body,
        id,
      },
    );

    this.logger.trace('send done');
  }
}

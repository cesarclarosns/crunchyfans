import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SqsService } from '@ssut/nestjs-sqs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

import { config } from '@/config';

import { MEDIA_EVENTS } from '../events';
import { MediaCreatedEvent } from '../events/media-created.event';
import { getMediaTypeFromFileKey } from '../media.utils';

@Injectable()
export class TranscodeSubmitProducer {
  constructor(
    @InjectPinoLogger() private readonly logger: PinoLogger,
    private readonly sqsService: SqsService,
  ) {}

  async send(message: any) {
    // const parsedMessage =
    //   await transcodeMediaSubmitMessageSchema.parseAsync(message);
    // return await this.sqsService.send(
    //   config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME,
    //   {
    //     body: JSON.stringify(parsedMessage),
    //     id: uuidv4(),
    //   },
    // );
  }
}

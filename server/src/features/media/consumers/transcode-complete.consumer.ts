import { Injectable } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

import { config } from '@/config';

import { MediaService } from '../media.service';

@Injectable()
export class TranscodeCompleteConsumer {
  constructor(private readonly mediaService: MediaService) {}

  @SqsMessageHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME,
    false,
  )
  async handleMessage() {}

  @SqsConsumerEventHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME,
    'error',
  )
  async onError() {}

  @SqsConsumerEventHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME,
    'processing_error',
  )
  async onProcessingError() {}
}

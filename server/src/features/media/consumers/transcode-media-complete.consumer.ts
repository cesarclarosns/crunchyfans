import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';

import { config } from '@/config';

export class TranscodeMediaCompleteConsumer {
  @SqsMessageHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_MEDIA_COMPLETE_NAME,
    false,
  )
  async handleMessage() {}

  @SqsConsumerEventHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_MEDIA_COMPLETE_NAME,
    'error',
  )
  async onError() {}

  @SqsConsumerEventHandler(
    config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_MEDIA_COMPLETE_NAME,
    'processing_error',
  )
  async onProcessingError() {}
}

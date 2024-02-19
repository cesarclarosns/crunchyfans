import { OnEvent } from '@nestjs/event-emitter';
import { SqsService } from '@ssut/nestjs-sqs';

import { MEDIA_EVENTS } from '../events';
import { MediaCreatedEvent } from '../events/media-created.event';

export class TranscodeMediaSubmitProducer {
  constructor(private readonly sqsService: SqsService) {}

  async produce(message: string) {
    // await this.sqsService.send('', message);
    // await this.snsService.publish({
    //   message,
    //   topicArn: config.EVENTS.SNS_TOPIC_MEDIA_IMAGE_CREATED_ARN,
    // });
  }

  @OnEvent(MEDIA_EVENTS.MediaCreated, { promisify: true })
  async handleMediaImageCreatedEvent(payload: MediaCreatedEvent) {
    if (payload.mediaType === 'image' || payload.mediaType === 'video') {
    }
  }
}

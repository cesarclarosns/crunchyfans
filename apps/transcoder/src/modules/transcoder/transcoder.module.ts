import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';

import { settings } from '@/config/settings';

import { TranscodeSubmitConsumer } from './consumers/transcode-submit.consumer';
import { TranscodeCompleteProducer } from './producers/transcode-complete.producer';
import { StorageService } from './storage.service';
import { TranscoderService } from './transcoder.service';

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: async () => {
        const sqs = new SQSClient({
          credentials: {
            accessKeyId: settings.AWS.ACCESS_KEY_ID,
            secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
          },
          endpoint: settings.AWS.SQS_ENDPOINT_URL,
          region: settings.AWS.REGION,
        });

        return {
          consumers: [
            {
              batchSize: 1,
              name: settings.TRANSCODER.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_NAME,
              queueUrl:
                settings.TRANSCODER.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_URL,
              sqs,
            },
          ],
          producers: [
            {
              batchSize: 1,
              name: settings.TRANSCODER.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME,
              queueUrl:
                settings.TRANSCODER.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL,
              sqs,
            },
          ],
        };
      },
    }),
  ],
  providers: [
    StorageService,
    TranscoderService,
    TranscodeSubmitConsumer,
    TranscodeCompleteProducer,
  ],
})
export class TranscoderModule {}

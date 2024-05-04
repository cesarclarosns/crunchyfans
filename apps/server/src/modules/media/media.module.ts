import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SqsModule } from '@ssut/nestjs-sqs';

import { settings } from '@/config/settings';

import { TranscodeCompleteConsumer } from './application/jobs/consumers/transcode-complete.consumer';
import { TranscodeSubmitProducer } from './application/jobs/producers/transcode-submit.producer';
import { MediaService } from './application/services/media.service';
import { StorageService } from './application/services/storage.service';
import { Media, MediaSchema } from './infrastructure/entities/media.entity';
import { MediaController } from './presentation/controllers/media.controller';

@Module({
  controllers: [MediaController],
  exports: [MediaService, MongooseModule],
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
    // SqsModule.registerAsync({
    //   useFactory: async () => {
    //     const sqs = new SQSClient({
    //       credentials: {
    //         accessKeyId: settings.AWS.ACCESS_KEY_ID,
    //         secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
    //       },
    //       endpoint: settings.AWS.SQS_ENDPOINT_URL,
    //       region: settings.AWS.REGION,
    //     });

    //     return {
    //       consumers: [
    //         {
    //           batchSize: 1,
    //           name: settings.MEDIA.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_NAME,
    //           queueUrl: settings.MEDIA.SQS_QUEUE_TRANSCODE_MEDIA_COMPLETE_URL,
    //           sqs,
    //         },
    //       ],
    //       producers: [
    //         {
    //           batchSize: 1,
    //           name: settings.MEDIA.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_NAME,
    //           queueUrl: settings.MEDIA.SQS_QUEUE_TRANSCODE_MEDIA_SUBMIT_URL,
    //           sqs,
    //         },
    //       ],
    //     };
    //   },
    // }),
  ],
  providers: [
    MediaService,
    StorageService,
    // TranscodeMediaSubmitProducer,
    // TranscodeMediaCompleteConsumer,
  ],
})
export class MediaModule {}

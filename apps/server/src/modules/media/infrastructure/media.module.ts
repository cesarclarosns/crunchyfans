import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaService } from '../application/services/media.service';
import { StorageService } from '../application/services/storage.service';
import { MediaController } from '../presentation/controllers/media.controller';
import { Media, MediaSchema } from '../domain/entities/media.entity';

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

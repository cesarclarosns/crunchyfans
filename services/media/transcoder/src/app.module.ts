import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { LoggerModule } from 'nestjs-pino';

import { AWS_SQS_ENDPOINT_URL, config } from './config';
import { TranscoderModule } from './transcoder/transcoder.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
        transport: {
          target: 'pino-pretty',
        },
      },
      useExisting: true,
    }),
    SqsModule.registerAsync({
      useFactory: async () => {
        const sqs = new SQSClient({
          credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
          },
          endpoint: AWS_SQS_ENDPOINT_URL,
          region: config.AWS_REGION,
        });

        return {
          consumers: [
            {
              batchSize: 1,
              name: config.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME,
              queueUrl: config.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL,
              sqs,
            },
          ],
          producers: [
            {
              batchSize: 1,
              name: config.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME,
              queueUrl: config.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL,
              sqs,
            },
          ],
        };
      },
    }),
    TranscoderModule,
  ],
  providers: [],
})
export class AppModule {}

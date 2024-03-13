// import { SQSClient } from '@aws-sdk/client-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';

import { config } from './config';

// import { config } from './config';

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: async () => {
        const sqs = new SQSClient({
          credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
          },
          region: 'us-east-1',
        });

        return {
          consumers: [],
          producers: [],
        };
      },
    }),
  ],
  providers: [],
})
export class AppModule {}

import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { LoggerModule } from 'nestjs-pino';

import { TranscoderModule } from '@/modules/transcoder/transcoder.module';

import { settings } from './config/settings';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'debug',
        transport:
          process.env.NODE_ENV !== 'prod'
            ? {
                target: 'pino-pretty',
              }
            : undefined,
      },
    }),
    TranscoderModule,
  ],
  providers: [],
})
export class AppModule {}

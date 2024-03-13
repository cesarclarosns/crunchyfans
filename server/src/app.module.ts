// import { TRedisClientOptions } from '@common/types/redis';
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { SQSClient } from '@aws-sdk/client-sqs';
import { Module } from '@nestjs/common';
import {
  APP_GUARD,
  // APP_INTERCEPTOR,
} from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SqsModule } from '@ssut/nestjs-sqs';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from '@/features/auth/auth.module';
import { AccessTokenGuard } from '@/features/auth/guards';
import { EmailModule } from '@/features/email/email.module';
import { HealthModule } from '@/features/health/health.module';
import { MediaModule } from '@/features/media/media.module';
import { NotificationsModule } from '@/features/notifications/notifications.module';
import { PaymentsModule } from '@/features/payments/payments.module';
import { PostsModule } from '@/features/posts/posts.module';
import { SocketModule } from '@/features/socket/socket.module';
import { SubscriptionsModule } from '@/features/subscriptions/subscriptions.module';
import { UsersModule } from '@/features/users/users.module';

// import redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AWS_SQS_ENDPOINT_URL, config } from './config';
import { ChatsModule } from './features/chats/chats.module';

@Module({
  controllers: [AppController],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
        transport: {
          levels: {},
          target: 'pino-pretty',
        },
      },
      useExisting: true,
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      wildcard: false,
    }),
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     { limit: config.THROTTLER.LIMIT, ttl: config.THROTTLER.TTL },
    //   ],
    // }),
    MongooseModule.forRoot(config.DATABASE.URI),
    // CacheModule.registerAsync<TRedisClientOptions>({
    //   useFactory: (configService: ConfigService) => ({
    //     store: redisStore,
    //     url: configService.getOrThrow<string>(CONFIG_VALUES.cache.url),
    //   }),
    // }),
    SqsModule.registerAsync({
      useFactory: async () => {
        const sqs = new SQSClient({
          credentials: {
            accessKeyId: config.AWS.ACCESS_KEY_ID,
            secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
          },
          endpoint: AWS_SQS_ENDPOINT_URL,
          region: config.AWS.REGION,
        });

        return {
          consumers: [
            {
              batchSize: 1,
              name: config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_NAME,
              queueUrl: config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_COMPLETE_URL,
              sqs,
            },
          ],
          producers: [
            {
              batchSize: 1,
              name: config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_NAME,
              queueUrl: config.EVENTS.SQS_QUEUE_MEDIA_TRANSCODE_SUBMIT_URL,
              sqs,
            },
          ],
        };
      },
    }),
    AuthModule,
    MediaModule,
    NotificationsModule,
    UsersModule,
    EmailModule,
    HealthModule,
    PaymentsModule,
    PostsModule,
    SubscriptionsModule,
    SocketModule,
    ChatsModule,
  ],
  providers: [
    AppService,
    // { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}

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

// import configuration, {
//   CONFIG_VALUES,
//   configurationValidationSchema,
// } from '@/config/config';
import { AuthModule } from '@/features/auth/auth.module';
import { AccessTokenGuard } from '@/features/auth/guards';
import { EmailModule } from '@/features/email/email.module';
import { FollowersModule } from '@/features/followers/followers.module';
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
import { config } from './config';
import { ChatsModule } from './features/chats/chats.module';
import { SnsModule } from './providers/sns/sns.module';

@Module({
  controllers: [AppController],
  imports: [
    // ConfigModule.forRoot({
    //   cache: true,
    //   isGlobal: true,
    //   load: [config],
    //   validate: () => {
    //     return configSchema.parse(config());
    //   },
    // }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      wildcard: false,
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => [
    //     {
    //       limit: configService.getOrThrow<number>(
    //         CONFIG_VALUES.THROTTLER.LIMIT,
    //       ),
    //       ttl: configService.getOrThrow<number>(CONFIG_VALUES.THROTTLER.TTL),
    //     },
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
          region: config.AWS.REGION,
        });

        return {
          consumers: [
            // {
            //   batchSize: 1,
            //   name: configService.getOrThrow<string>(
            //     CONFIG_VALUES.EVENTS
            //       .SQS_QUEUE_MEDIA_TRANSCODE_IMAGE_COMPLETE_NAME,
            //   ),
            //   queueUrl: configService.getOrThrow<string>(
            //     CONFIG_VALUES.EVENTS
            //       .SQS_QUEUE_MEDIA_TRANSCODE_IMAGE_COMPLETE_URL,
            //   ),
            //   sqs,
            // },
            // {
            //   batchSize: 1,
            //   name: configService.getOrThrow<string>(
            //     CONFIG_VALUES.EVENTS
            //       .SQS_QUEUE_MEDIA_TRANSCODE_VIDEO_COMPLETE_NAME,
            //   ),
            //   queueUrl: configService.getOrThrow<string>(
            //     CONFIG_VALUES.EVENTS
            //       .SQS_QUEUE_MEDIA_TRANSCODE_VIDEO_COMPLETE_URL,
            //   ),
            //   sqs,
            // },
          ],
          producers: [],
        };
      },
    }),
    SnsModule,
    AuthModule,
    MediaModule,
    NotificationsModule,
    UsersModule,
    EmailModule,
    FollowersModule,
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

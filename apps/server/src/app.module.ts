import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { settings } from './config/settings';
import { DatabaseModule } from './core/database/database.module';
import { AccessTokenGuard } from './modules/auth/application/guards';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';
import { EmailModule } from './modules/email/email.module';
import { FollowersModule } from './modules/followers/followers.module';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PostsModule } from './modules/posts/posts.module';
import { SocketModule } from './modules/socket/socket.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TimelinesModule } from './modules/timelines/timelines.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
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
    ThrottlerModule.forRoot({
      throttlers: [
        { limit: settings.THROTTLER.LIMIT, ttl: settings.THROTTLER.TTL },
      ],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    MediaModule,
    NotificationsModule,
    EmailModule,
    HealthModule,
    PaymentsModule,
    PostsModule,
    SubscriptionsModule,
    SocketModule,
    ChatsModule,
    FollowersModule,
    TimelinesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}

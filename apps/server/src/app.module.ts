import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { settings } from '@/config/settings';
import { RedisModule } from '@/core/redis/redis.module';
import { AccessTokenGuard } from '@/modules/auth/application/guards';
import { AuthModule } from '@/modules/auth/infrastructure/auth.module';
import { ChatsModule } from '@/modules/chats/infrastructure/chats.module';
import { EmailModule } from '@/modules/email/infrastructure/email.module';
import { FollowersModule } from '@/modules/followers/infrastructure/followers.module';
import { HealthModule } from '@/modules/health/infrastructure/health.module';
import { MediaModule } from '@/modules/media/infrastructure/media.module';
import { NotificationsModule } from '@/modules/notifications/infrastructure/notifications.module';
import { PaymentsModule } from '@/modules/payments/infrastructure/payments.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { ReviewsModule } from '@/modules/reviews/reviews.module';
import { SocketModule } from '@/modules/socket/infrastructure/socket.module';
import { SubscriptionsModule } from '@/modules/subscriptions/infrastructure/subscriptions.module';
import { UsersModule } from '@/modules/users/users.module';

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
    MongooseModule.forRoot(settings.DATABASES.MONGODB_URI),
    // RedisModule,
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
    ReviewsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}

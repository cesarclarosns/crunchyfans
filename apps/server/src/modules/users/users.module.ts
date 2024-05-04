import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatsModule } from '../chats/chats.module';
import { MediaModule } from '../media/media.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UsersService } from './application/services/users.service';
import {
  User,
  UserSchema,
} from './infrastructure/repositories/mongodb/schemas/user.schema';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  exports: [MongooseModule, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MediaModule,
    ChatsModule,
    SubscriptionsModule,
    PostsModule,
    NotificationsModule,
  ],
  providers: [UsersService],
})
export class UsersModule {}

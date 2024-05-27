import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatsModule } from '@/modules/chats/infrastructure/chats.module';
import { MediaModule } from '@/modules/media/infrastructure/media.module';
import { NotificationsModule } from '@/modules/notifications/infrastructure/notifications.module';
import { PostsModule } from '@/modules/posts/infrastructure/posts.module';
import { SubscriptionsModule } from '@/modules/subscriptions/infrastructure/subscriptions.module';
import { UsersService } from '@/modules/users/application/services/users.service';
import {
  User,
  UserSchema,
} from '@/modules/users/infrastructure/repositories/entities/user.entity';
import { UsersRepository } from '@/modules/users/infrastructure/repositories/users.repository';
import { UsersController } from '@/modules/users/presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  exports: [MongooseModule, UsersService, UsersRepository],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MediaModule,
    ChatsModule,
    SubscriptionsModule,
    PostsModule,
    NotificationsModule,
  ],
  providers: [UsersRepository, UsersService],
})
export class UsersModule {}

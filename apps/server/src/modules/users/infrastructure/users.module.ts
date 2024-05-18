import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatsModule } from '../../chats/infrastructure/chats.module';
import { MediaModule } from '../../media/infrastructure/media.module';
import { NotificationsModule } from '../../notifications/infrastructure/notifications.module';
import { PostsModule } from '../../posts/infrastructure/posts.module';
import { SubscriptionsModule } from '../../subscriptions/infrastructure/subscriptions.module';
import { UsersService } from '../application/services/users.service';
import { User, UserSchema } from './repositories/entities/user.entity';
import { UsersController } from '../presentation/controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';

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
  providers: [UsersRepository, UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { ChatsModule } from '@/modules/chats/chats.module';
import { MediaModule } from '@/modules/media/media.module';
import { NotificationsModule } from '@/modules/notifications/notifications.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { UsersService } from '@/modules/users/application/services/users.service';
import { IUsersRepository } from '@/modules/users/domain/repositories/users.repository';
import {
  User,
  UserSchema,
} from '@/modules/users/infrastructure/repositories/mongo/entities/user.entity';
import { MongoUsersRepository } from '@/modules/users/infrastructure/repositories/mongo/mongo-users.repository';
import { UsersController } from '@/modules/users/presentation/controllers/users.controller';

@Module({
  controllers: [UsersController],
  exports: [MongooseModule, IUsersRepository, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MediaModule,
    ChatsModule,
    SubscriptionsModule,
    PostsModule,
    NotificationsModule,
  ],
  providers: [
    { provide: IUsersRepository, useClass: MongoUsersRepository },
    {
      provide: IUnitOfWorkFactory,
      useClass: MongoUnitOfWorkFactory,
    },
    UsersService,
  ],
})
export class UsersModule {}

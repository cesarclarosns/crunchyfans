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
import { IAccountsRepository } from '@/modules/users/domain/repositories/accounts.repository';
import { IUsersRepository } from '@/modules/users/domain/repositories/users.repository';
import { MongoAccountsRepository } from '@/modules/users/infrastructure/repositories/mongo-accounts.repository';
import { MongoUsersRepository } from '@/modules/users/infrastructure/repositories/mongo-users.repository';
import { UsersController } from '@/modules/users/presentation/controllers/users.controller';

import {
  MongoAccount,
  MongoAccountSchema,
  MongoUser,
  MongoUserSchema,
} from './infrastructure/entities';

@Module({
  controllers: [UsersController],
  exports: [
    MongooseModule,
    IAccountsRepository,
    IUsersRepository,
    UsersService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: MongoAccount.name, schema: MongoAccountSchema },
      { name: MongoUser.name, schema: MongoUserSchema },
    ]),
    MediaModule,
    ChatsModule,
    SubscriptionsModule,
    PostsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: IAccountsRepository,
      useClass: MongoAccountsRepository,
    },
    { provide: IUsersRepository, useClass: MongoUsersRepository },
    {
      provide: IUnitOfWorkFactory,
      useClass: MongoUnitOfWorkFactory,
    },
    UsersService,
  ],
})
export class UsersModule {}

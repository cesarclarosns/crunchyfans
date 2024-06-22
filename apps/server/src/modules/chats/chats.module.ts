import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { ChatsService } from '@/modules/chats/application/services/chats.service';
import { MediaModule } from '@/modules/media/media.module';
import { UsersModule } from '@/modules/users/users.module';

import { IChatsRepository } from './domain/repositories/chats.repository';
import {
  MongoChat,
  MongoChatSchema,
  MongoMessage,
  MongoMessageSchema,
  MongoUserChat,
  MongoUserChatSchema,
  MongoUserMessage,
  MongoUserMessageSchema,
} from './infrastructure/entities';
import { MongoChatsRepository } from './infrastructure/repositories/mongo-chats.repository';
import { ChatsController } from './presentation/controllers/chats.controller';

@Module({
  controllers: [ChatsController],
  exports: [ChatsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoChat.name,
        schema: MongoChatSchema,
      },
      {
        name: MongoMessage.name,
        schema: MongoMessageSchema,
      },
      {
        name: MongoUserMessage.name,
        schema: MongoUserMessageSchema,
      },
      {
        name: MongoUserChat.name,
        schema: MongoUserChatSchema,
      },
    ]),
    MediaModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    ChatsService,
    { provide: IChatsRepository, useClass: MongoChatsRepository },
    {
      provide: IUnitOfWorkFactory,
      useClass: MongoUnitOfWorkFactory,
    },
  ],
})
export class ChatsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MongoUnitOfWorkFactory } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { ChatsService } from '@/modules/chats/application/services/chats.service';
import {
  Chat,
  ChatSchema,
  Message,
  MessageSchema,
  UserChat,
  UserChatSchema,
  UserMessage,
  UserMessageSchema,
} from '@/modules/chats/infrastructure/repositories/mongo/entities';
import { MediaModule } from '@/modules/media/media.module';
import { UsersModule } from '@/modules/users/users.module';

import { IChatsRepository } from './domain/repositories/chats.repository';
import { MongoChatsRepository } from './infrastructure/repositories/mongo/mongo-chats.repository';
import { ChatsController } from './presentation/controllers/chats.controller';

@Module({
  controllers: [ChatsController],
  exports: [ChatsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: UserMessage.name,
        schema: UserMessageSchema,
      },
      {
        name: UserChat.name,
        schema: UserChatSchema,
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

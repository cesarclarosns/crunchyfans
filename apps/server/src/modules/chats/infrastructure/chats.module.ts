import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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
} from '@/modules/chats/domain/entities';
import { ChatsController } from '@/modules/chats/presentation/controllers/chats.controller';
import { MediaModule } from '@/modules/media/infrastructure/media.module';
import { UsersModule } from '@/modules/users/infrastructure/users.module';

import { ChatsRepository } from './repositories/chats.repository';

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
  providers: [ChatsService, ChatsRepository],
})
export class ChatsModule {}

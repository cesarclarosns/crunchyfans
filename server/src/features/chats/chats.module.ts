import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '../media/media.module';
import { UsersModule } from '../users/users.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';
import {
  LastReadChatMessagePerUser,
  LastReadChatMessagePerUserSchema,
} from './entities/last-read-chat-message-per-user.entity';

@Module({
  controllers: [ChatsController],
  exports: [ChatsService],
  imports: [
    MediaModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
      {
        name: LastReadChatMessagePerUser.name,
        schema: LastReadChatMessagePerUserSchema,
      },
    ]),
  ],
  providers: [ChatsService],
})
export class ChatsModule {}

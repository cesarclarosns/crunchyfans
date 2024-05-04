import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '@/modules/media/media.module';
import { UsersModule } from '@/modules/users/users.module';

import { ChatsService } from './chats.service';
import { Chat, ChatSchema } from './infrastructure/schemas/chat.schema';
import {
  LastReadMessagePerUser,
  LastReadMessagePerUserSchema,
} from './infrastructure/schemas/last-read-message-per-user.schema';
import {
  Message,
  MessageSchema,
} from './infrastructure/schemas/message.schema';
import {
  UserMessageAccess,
  UserMessageAccessSchema,
} from './infrastructure/schemas/user-messages-access.schema';
import { ChatsHttpController } from './presentation/controllers/chats.http-controller';
import { ChatsTcpController } from './presentation/controllers/chats.tcp-controller';

@Module({
  controllers: [ChatsHttpController, ChatsTcpController],
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
        name: LastReadMessagePerUser.name,
        schema: LastReadMessagePerUserSchema,
      },
      {
        name: UserMessageAccess.name,
        schema: UserMessageAccessSchema,
      },
    ]),
    MediaModule,
    forwardRef(() => UsersModule),
  ],
  providers: [ChatsService],
})
export class ChatsModule {}

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaModule } from '@/features/media/media.module';
import { UsersModule } from '@/features/users/users.module';

import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat, ChatSchema } from './entities/chat.entity';
import {
  LastReadMessagePerUser,
  LastReadMessagePerUserSchema,
} from './entities/last-read-message-per-user.entity';
import { Message, MessageSchema } from './entities/message.entity';

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
        name: LastReadMessagePerUser.name,
        schema: LastReadMessagePerUserSchema,
      },
    ]),
    MediaModule,
    forwardRef(() => UsersModule),
  ],
  providers: [ChatsService],
})
export class ChatsModule {}

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { User } from '@/features/users/entities/user.entity';

import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { LastReadChatMessagePerUser } from './entities/last-read-chat-message-per-user.entity';

@Injectable()
export class ChatsSeeder implements Seeder {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @InjectModel(LastReadChatMessagePerUser.name)
    private readonly lastReadChatMessagePerUserModel: Model<LastReadChatMessagePerUser>,
    private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find();

    return await Promise.all(
      users.map(async (user, i) => {
        if (i == 0) return;

        const chatsRecords = DataFactory.createForClass(Chat).generate(1, {
          participants: [user._id.toString(), users[0]._id.toString()],
        });
        const chats = await this.chatModel.insertMany(chatsRecords);

        await Promise.all(
          chats.map(async (chat) => {
            const getChatMessageRecord = () => {
              const records = DataFactory.createForClass(ChatMessage).generate(
                1,
                {
                  _id: mongoose.Types.ObjectId.createFromTime(
                    faker.date.recent({ days: 15 }).getTime() / 1000,
                  ),
                  chatId: chat._id.toString(),
                  userId: user._id.toString(),
                },
              );
              return records.at(0);
            };

            const chatMessageRecords = [...Array(10)].map(() =>
              getChatMessageRecord(),
            );

            const chatMessages =
              await this.chatMessageModel.insertMany(chatMessageRecords);

            const chatMessage =
              chatMessages[Math.floor(Math.random() * chatMessages.length)];

            await this.lastReadChatMessagePerUserModel.create({
              chatId: chatMessage.chatId.toString(),
              messageId: chatMessage._id.toString(),
              userId: users[0]._id.toString(),
            });
          }),
        );
      }),
    );
  }

  async drop(): Promise<any> {
    await Promise.all([
      this.chatModel.deleteMany({}),
      this.chatMessageModel.deleteMany({}),
      this.lastReadChatMessagePerUserModel.deleteMany({}),
    ]);
  }
}

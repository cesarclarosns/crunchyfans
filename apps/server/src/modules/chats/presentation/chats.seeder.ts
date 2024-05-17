import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { User } from '@/modules/users/domain/entities/user.entity';

import { Chat } from '../domain/entities/chat.entity';
import { LastReadMessagePerUser } from '../domain/entities/user-chat.entity';
import { Message } from '../domain/entities/message.entity';

@Injectable()
export class ChatsSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    @InjectModel(LastReadMessagePerUser.name)
    private readonly lastReadMessagePerUserModel: Model<LastReadMessagePerUser>,
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find();

    return await Promise.all(
      users.map(async (user, i) => {
        if (i == 0) return;

        // Create chats
        const chat = await this.chatModel.create({
          participants: [user._id.toString(), users[0]._id.toString()],
        });

        // Create messages
        const messageRecords = DataFactory.createForClass(Message).generate(
          10,
          {
            chatId: chat._id.toString(),
            userId: user._id.toString(),
          },
        );

        await this.messageModel.insertMany(messageRecords);

        // Read messages
        const messages = await this.messageModel.aggregate([
          {
            $match: {
              chatId: chat._id,
            },
          },
          { $sample: { size: 10 } },
        ]);

        await this.lastReadMessagePerUserModel.insertMany([
          ...messages.map((message) => ({
            chatId: message.chatId,
            messageId: message._id,
            userId: users[0]._id,
          })),
          ...messages.map((message) => ({
            chatId: message.chatId,
            messageId: message._id,
            userId: user._id,
          })),
        ]);
      }),
    );
  }

  async drop(): Promise<any> {
    await Promise.all([
      this.chatModel.deleteMany({}),
      this.messageModel.deleteMany({}),
      this.lastReadMessagePerUserModel.deleteMany({}),
    ]);
  }
}
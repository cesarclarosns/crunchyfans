import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import {
  MongoChat,
  MongoMessage,
} from '@/modules/chats/infrastructure/entities';
import { MongoUser } from '@/modules/users/infrastructure/entities';

@Injectable()
export class MongoChatsSeeder implements Seeder {
  constructor(
    @InjectModel(MongoUser.name) private readonly _userModel: Model<MongoUser>,
    @InjectModel(MongoChat.name) private readonly _chatModel: Model<MongoChat>,
    @InjectModel(MongoMessage.name)
    private readonly _messageModel: Model<MongoMessage>,
  ) {}

  async seed(): Promise<any> {}

  async drop(): Promise<any> {
    await Promise.all([
      this._chatModel.deleteMany({}),
      this._messageModel.deleteMany({}),
    ]);
  }
}

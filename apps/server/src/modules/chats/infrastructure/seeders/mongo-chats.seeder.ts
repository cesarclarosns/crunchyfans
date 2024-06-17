import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import {
  Chat,
  Message,
} from '@/modules/chats/infrastructure/repositories/mongo/entities';
import { User } from '@/modules/users/infrastructure/repositories/mongo/entities';

@Injectable()
export class MongoChatsSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly _userEntity: Model<User>,
    @InjectModel(Chat.name) private readonly _chatEntity: Model<Chat>,
    @InjectModel(Message.name)
    private readonly _messageEntity: Model<Message>,
  ) {}

  async seed(): Promise<any> {}

  async drop(): Promise<any> {
    await Promise.all([
      this._chatEntity.deleteMany({}),
      this._messageEntity.deleteMany({}),
    ]);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Media as MediaEntity } from '@/modules/media/infrastructure/repositories/entities/media.entity';
import { User as UserEntity } from '@/modules/users/infrastructure/repositories/mongo/entities/user.entity';

@Injectable()
export class MongoMediaSeeder implements Seeder {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly _userEntity: Model<UserEntity>,
    @InjectModel(MediaEntity.name)
    private readonly _mediaEntity: Model<MediaEntity>,
  ) {}

  async seed() {}

  async drop() {
    await Promise.all([await this._userEntity.deleteMany({})]);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Media as MediaEntity } from '@/modules/media/infrastructure/repositories/entities/media.entity';
import { User as UserEntity } from '@/modules/users/infrastructure/repositories/entities/user.entity';

@Injectable()
export class MediaSeeder implements Seeder {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly _userModel: Model<UserEntity>,
    @InjectModel(MediaEntity.name)
    private readonly _mediaModel: Model<MediaEntity>,
  ) {}

  async seed() {}

  async drop() {
    await Promise.all([await this._mediaModel.deleteMany({})]);
  }
}

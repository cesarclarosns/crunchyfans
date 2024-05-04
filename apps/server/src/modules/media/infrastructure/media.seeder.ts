import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Media } from '@/modules/media/infrastructure/entities/media.entity';
import { User } from '@/modules/users/infrastructure/repositories/mongodb/schemas/user.schema';

@Injectable()
export class MediaSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async seed() {}

  async drop() {
    await Promise.all([await this.mediaModel.deleteMany({})]);
  }
}

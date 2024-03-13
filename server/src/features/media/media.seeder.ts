import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { Media } from '../media/entities/media.entity';
import { User } from '../users/entities/user.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { TRANSCODING_STATUS } from './media.constants';

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

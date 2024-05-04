import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import argon2 from 'argon2';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { User } from '@/modules/users/infrastructure/repositories/mongodb/schemas/user.schema';

import { Media } from '../../media/infrastructure/entities/media.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
  ) {}

  async seed(): Promise<any> {
    const password = await argon2.hash('password123456');

    await Promise.all(
      [...Array(10)].map(async () => {
        const users = DataFactory.createForClass(User).generate(1, {
          gender: 'male',
          password,
        });

        return await this.userModel.insertMany(users);
      }),
    );
  }

  async drop(): Promise<any> {
    return await this.userModel.deleteMany({});
  }
}

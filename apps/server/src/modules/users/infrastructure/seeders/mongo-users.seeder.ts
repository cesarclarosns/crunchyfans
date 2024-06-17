import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import argon2 from 'argon2';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Media } from '@/modules/media/infrastructure/repositories/entities';
import { User } from '@/modules/users/infrastructure/repositories/mongo/entities';

@Injectable()
export class MongoUsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name)
    private readonly _userEntity: Model<User>,
    @InjectModel(Media.name)
    private readonly _mediaEntity: Model<Media>,
  ) {}

  async seed(): Promise<any> {
    // const password = await argon2.hash('password');
    // await Promise.all(
    //   [...Array(10)].map(async () => {
    //     const users = DataFactory.createForClass(UserEntity).generate(1, {
    //       gender: 'male',
    //       password,
    //     });
    //     return await this._userEntity.insertMany(users);
    //   }),
    // );
  }

  async drop(): Promise<any> {
    return await this._userEntity.deleteMany({});
  }
}

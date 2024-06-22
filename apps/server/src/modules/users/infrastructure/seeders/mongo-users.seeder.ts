import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { MongoUser } from '@/modules/users/infrastructure/entities/mongo-user.entity';

@Injectable()
export class MongoUsersSeeder implements Seeder {
  constructor(
    @InjectModel(MongoUser.name)
    private readonly _userModel: Model<MongoUser>,
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
    return await this._userModel.deleteMany({});
  }
}

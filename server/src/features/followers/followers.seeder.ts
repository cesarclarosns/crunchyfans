import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { AuthService } from '@/features/auth/auth.service';
import { User } from '@/features/users/entities/user.entity';

import { Follower } from './entities/follower.entity';

@Injectable()
export class FollowersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Follower.name) private readonly followerModel: Model<Follower>,
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find({});

    const docs = [];

    for (const follower of users) {
      for (const followee of users) {
        const followerId = follower._id.toString();
        const followeeId = followee._id.toString();
        if (followeeId !== followerId) {
          docs.push({ followeeId, followerId });
        }
      }
    }

    await this.followerModel.insertMany(docs);
  }

  async drop(): Promise<any> {
    return await this.followerModel.deleteMany({});
  }
}

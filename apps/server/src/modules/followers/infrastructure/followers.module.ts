import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FollowersController } from '../presentation/controllers/followers.controller';
import {
  Follower,
  FollowerSchema,
} from './repositories/entities/follower.entity';

@Module({
  controllers: [FollowersController],
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
})
export class FollowersModule {}

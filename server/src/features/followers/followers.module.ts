import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { Follower, FollowerSchema } from './entities/follower.entity';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  controllers: [FollowersController],
  exports: [MongooseModule],
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
    UsersModule,
  ],
  providers: [FollowersService],
})
export class FollowersModule {}

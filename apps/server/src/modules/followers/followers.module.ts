import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FollowersService } from '@/modules/followers/application/services/followers.service';
import {
  MongoFollower,
  MongoFollowerSchema,
} from '@/modules/followers/infrastructure/entities/';
import { FollowersController } from '@/modules/followers/presentation/controllers/followers.controller';

@Module({
  controllers: [FollowersController],
  exports: [FollowersService],
  imports: [
    MongooseModule.forFeature([
      { name: MongoFollower.name, schema: MongoFollowerSchema },
    ]),
  ],
  providers: [FollowersService],
})
export class FollowersModule {}

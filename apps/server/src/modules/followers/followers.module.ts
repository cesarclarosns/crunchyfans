import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FollowersService } from '@/modules/followers/application/services/followers.service';
import {
  Follower,
  FollowerSchema,
} from '@/modules/followers/infrastructure/repositories/entities/follower.entity';
import { FollowersController } from '@/modules/followers/presentation/controllers/followers.controller';

@Module({
  controllers: [FollowersController],
  exports: [FollowersService],
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  providers: [FollowersService],
})
export class FollowersModule {}

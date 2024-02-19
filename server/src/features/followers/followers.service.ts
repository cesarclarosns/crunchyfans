import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { UsersService } from '../users/users.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { FindAllFolloweesDto } from './dto/find-all-followees.dto';
import { FindAllFollowersDto } from './dto/find-all-followers.dto';
import { FollowerDto } from './dto/follower.dto';
import { RemoveFollowerDto } from './dto/remove-follower.dto';
import { Follower } from './entities/follower.entity';
import {
  FollowerCreatedEvent,
  FollowerRemovedEvent,
  FOLLOWERS_EVENTS,
} from './events';

@Injectable()
export class FollowersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Follower.name) private readonly followerModel: Model<Follower>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create({ followeeId, followerId }: CreateFollowerDto) {
    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const follower = await this.followerModel.findOneAndUpdate(
          { followeeId, followerId },
          {},
          { session, upsert: true },
        );

        if (!follower) {
          await this.eventEmitter.emitAsync(
            FOLLOWERS_EVENTS.FollowerCreated,
            new FollowerCreatedEvent({
              followeeId,
              followerId,
            }),
          );
        }

        return follower;
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async findAllFollowers({ skip, limit, cursor, target }: FindAllFollowersDto) {
    let followers: FollowerDto[] = await this.followerModel
      .find(
        {
          followeeId: target,
          ...(cursor
            ? {
                _id: {
                  $lt: cursor,
                },
              }
            : {}),
        },
        {},
        { limit: +limit, skip: +skip },
      )
      .populate([
        {
          path: 'follower',
          populate: {
            path: 'pictures.profilePicture',
          },
          select: '-password -oauth -settings -metadata',
        },
      ]);

    followers = JSON.parse(JSON.stringify(followers));

    for (const follower of followers) {
      this.usersService.downloadPictures(follower.follower);
    }

    return followers;
  }

  async findAllFollowees({ skip, limit, cursor, target }: FindAllFolloweesDto) {
    let followees: FollowerDto[] = await this.followerModel
      .find(
        {
          followerId: target,
          ...(cursor
            ? {
                _id: {
                  $lt: cursor,
                },
              }
            : {}),
        },
        {},
        { limit: +limit, skip: +skip },
      )
      .populate([
        {
          path: 'followee',
          populate: {
            path: 'pictures.profilePicture',
          },
          select: '-password -oauth -settings -metadata',
        },
      ]);

    followees = JSON.parse(JSON.stringify(followees));

    for (const followee of followees) {
      this.usersService.downloadPictures(followee.followee);
    }

    return followees;
  }

  async remove({ followeeId, followerId }: RemoveFollowerDto) {
    const session = await this.connection.startSession();

    try {
      return await session.withTransaction(async () => {
        const deleteResult = await this.followerModel.deleteOne(
          {
            followeeId,
            followerId,
          },
          { session },
        );

        await this.eventEmitter.emitAsync(
          FOLLOWERS_EVENTS.FollowerRemoved,
          new FollowerRemovedEvent({
            followeeId,
            followerId,
          }),
        );

        return deleteResult;
      });
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      await session.endSession();
    }
  }
}

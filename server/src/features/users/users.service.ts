import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import {
  FollowerCreatedEvent,
  FollowerRemovedEvent,
  FOLLOWERS_EVENTS,
} from '../followers/events';
import { MediaService } from '../media/media.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users-dto';
import { IncrementUserMetadataDto } from './dto/increcement-user-metadata.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { TUserFilterQuery, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findAll({ cursor, skip, limit, query }: FindAllUsersDto) {
    let users = await this.userModel.aggregate([
      {
        $match: {},
      },
      {
        $skip: +skip,
      },
      {
        $limit: +limit,
      },
    ]);

    users = await this.userModel.populate(users, [
      { path: 'pictures.profilePicture' },
      { path: 'pictures.coverPicture' },
    ]);

    for (const user of users) {
      this.downloadPictures(user);
    }

    return users;
  }

  async findOne(filter: TUserFilterQuery) {
    return await this.userModel.findOne(filter);
  }

  async findOneById(userId: string) {
    return await this.userModel.findById(userId);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findOneByGoogleId(google_id: string) {
    return await this.userModel.findOne({ google_id });
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserDto },
      {
        new: true,
      },
    );
  }

  async findInfoById(userId: string) {
    const user = (
      await this.userModel
        .findById(userId, {
          oauth: 0,
          password: 0,
        })
        .populate([
          { path: 'pictures.profilePicture' },
          { path: 'pictures.coverPicture' },
        ])
    )?.toJSON();

    if (user) {
      this.downloadPictures(user as unknown as UserDto);
    }

    return user;
  }

  async findProfileByUsername({
    username,
    requesterId,
  }: {
    username: string;
    requesterId?: string;
  }) {
    let users = await this.userModel.aggregate([
      {
        $match: {
          username,
        },
      },
      ...(!!requesterId
        ? [
            {
              $lookup: {
                as: 'isFollowing',
                foreignField: 'followeeId',
                from: 'followers',
                localField: '_id',
                pipeline: [
                  {
                    $match: {
                      followerId: new mongoose.Types.ObjectId(requesterId),
                    },
                  },
                ],
              },
            },
            {
              $set: {
                isFollowing: {
                  $cond: {
                    else: false,
                    if: {
                      $ne: ['$isFollowing', []],
                    },
                    then: true,
                  },
                },
              },
            },
          ]
        : []),
      {
        $project: {
          oauth: 0,
          password: 0,
          settings: 0,
        },
      },
    ]);

    users = await this.userModel.populate(users, [
      { path: 'pictures.profilePicture' },
      { path: 'pictures.coverPicture' },
    ]);

    let user = users.at(0);

    if (user) {
      user = JSON.parse(JSON.stringify(user));
      this.downloadPictures(user as unknown as UserDto);
    }

    return user;
  }

  // Events
  @OnEvent(FOLLOWERS_EVENTS.FollowerCreated, { promisify: true })
  async handleFolllowersFollowerCreated(payload: FollowerCreatedEvent) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        const { followeeId, followerId } = payload;

        await Promise.all([
          this.userModel.updateOne(
            { _id: followerId },
            {
              $inc: {
                'metadata.followeesCount': 1,
              },
            },
          ),
          this.userModel.updateOne(
            { _id: followeeId },
            {
              $inc: {
                'metadata.followersCount': 1,
              },
            },
          ),
        ]);
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }
  }

  @OnEvent(FOLLOWERS_EVENTS.FollowerRemoved, { promisify: true })
  async handleFollowersFollowerRemoved(payload: FollowerRemovedEvent) {
    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      const { followeeId, followerId } = payload;

      await Promise.all([
        this.userModel.updateOne(
          { _id: followerId },
          {
            $inc: {
              'metadata.followeesCount': -1,
            },
          },
        ),
        this.userModel.updateOne(
          { _id: followeeId },
          {
            $inc: {
              'metadata.followersCount': -1,
            },
          },
        ),
      ]);
    });

    await session.endSession();
  }

  // Utils

  downloadPictures(user: UserDto) {
    if (user?.pictures) {
      if (user.pictures?.coverPicture) {
        this.mediaService.downloadMedia(user.pictures.coverPicture);
      }
      if (user.pictures?.profilePicture) {
        this.mediaService.downloadMedia(user.pictures.profilePicture);
      }
    }
  }
}

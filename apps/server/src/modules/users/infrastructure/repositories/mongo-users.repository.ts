import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/entities/user';
import { UserData } from '@/modules/users/domain/entities/user-data';
import {
  UserProfileBasic,
  UserProfileWithViewerData,
} from '@/modules/users/domain/entities/user-profile';
import { IUsersRepository } from '@/modules/users/domain/repositories/users.repository';
import { MongoUser } from '@/modules/users/infrastructure/entities';

@Injectable()
export class MongoUsersRepository implements IUsersRepository {
  constructor(
    @InjectPinoLogger(MongoUsersRepository.name)
    private readonly _logger: PinoLogger,
    @InjectModel(MongoUser.name) private _userModel: Model<MongoUser>,
  ) {}

  async createUser(create: CreateUserDto, uow: MongoUnitOfWork): Promise<User> {
    const [_user] = await this._userModel.insertMany([create], {
      session: uow.session,
    });

    const user = new User(_user.toJSON());
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const _user = await this._userModel.findOne({
      _id: userId,
    });
    if (!_user) return null;

    const user = new User(_user.toJSON());
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const _user = await this._userModel.findOne({
      username,
    });
    if (!_user) return null;

    const user = new User(_user.toJSON());
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const _user = await this._userModel.findOne({
      email,
    });
    if (!_user) return null;

    const user = new User(_user.toJSON());
    return user;
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    const _user = await this._userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      update,
    );
    if (!_user) return null;

    const user = new User(_user.toJSON());
    return user;
  }

  async deleteUser(userId: string): Promise<User | null> {
    const _user = await this._userModel.findOneAndDelete({
      _id: userId,
    });
    if (!_user.value) return null;

    const user = new User(_user.value.toJSON());
    return user;
  }

  async getUserDataById(userId: string): Promise<UserData | null> {
    const [_userData] = await this._userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          as: 'pictures.profile',
          foreignField: 'pictures.profile',
          from: 'media',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'pictures.cover',
          foreignField: 'pictures.cover',
          from: 'media',
          localField: '_id',
        },
      },
    ]);
    if (!_userData) return null;

    const userData = new UserData(JSON.parse(JSON.stringify(_userData)));
    return userData;
  }

  async getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]> {
    const _usersProfileBasic = await this._userModel.find([
      {
        $match: {
          ids: {
            $in: filter.ids?.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $lookup: {
          as: 'pictures.profile',
          foreignField: 'pictures.profile',
          from: 'media',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'pictures.cover',
          foreignField: 'pictures.cover',
          from: 'media',
          localField: '_id',
        },
      },
    ]);

    const usersProfileBasic = _usersProfileBasic.map(
      (_userProfileBasic) =>
        new UserProfileBasic(JSON.parse(JSON.stringify(_userProfileBasic))),
    );
    return usersProfileBasic;
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfileWithViewerData | null> {
    const [_userProfileWithViewerData] = await this._userModel.aggregate([
      { $match: { username } },
      {
        $lookup: {
          as: 'pictures.profile',
          foreignField: 'pictures.profile',
          from: 'media',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'pictures.cover',
          foreignField: 'pictures.cover',
          from: 'media',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'postsData',
          foreignField: 'userId',
          from: 'userPostsData',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'followersData',
          foreignField: 'userId',
          from: 'userFollowersData',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'subscriptionsData',
          foreignField: 'userId',
          from: 'userSubscriptionsData',
          localField: '_id',
        },
      },
      {
        $lookup: {
          as: 'subscription',
          foreignField: 'subscribeeId',
          from: 'subscription',
          localField: '_id',
          pipeline: [
            {
              $match: {
                subscriberId: new mongoose.Types.ObjectId(viewerId),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          as: 'following',
          foreignField: 'followeeId',
          from: 'follower',
          localField: '_id',
          pipeline: [
            {
              $match: {
                followerId: new mongoose.Types.ObjectId(viewerId),
              },
            },
          ],
        },
      },
    ]);

    if (!_userProfileWithViewerData) return null;

    const userProfileWithViewerData = new UserProfileWithViewerData(
      JSON.parse(JSON.stringify(_userProfileWithViewerData)),
    );
    return userProfileWithViewerData;
  }
}

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoDBContext } from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { MediaService } from '@/modules/media/application/services/media.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/models/user.model';
import { UserData } from '@/modules/users/domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
  UserProfileWithViewerData,
} from '@/modules/users/domain/models/user-profile.model';
import { User as UserEntity } from '@/modules/users/infrastructure/repositories/entities/user.entity';

export class UsersRepository {
  constructor(
    @InjectPinoLogger(UsersRepository.name)
    private readonly _logger: PinoLogger,
    @InjectModel(UserEntity.name) private _userModel: Model<UserEntity>,
  ) {}

  async createUser(
    create: CreateUserDto,
    dbContext: MongoDBContext,
  ): Promise<User> {
    const [_user] = await this._userModel.insertMany([create], {
      session: dbContext.session,
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

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const _user = await this._userModel.findOne({
      'oauth.googleId': googleId,
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
    const _result = await this._userModel.aggregate([
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

    const _user = await this._userModel.findOne({
      _id: userId,
    });
    if (!_user) return null;

    const user = new User({ ..._user.toJSON() });

    const userData = new UserData({
      chatsData: {} as any,
      id: user.id,
      name: user.name,
      notificationsData: {} as any,
      pictures: {} as any,
      username: user.username,
    });

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

    return [];
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfileWithViewerData | null> {
    const _userProfile = await this._userModel.aggregate([
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
                subscriberId: viewerId,
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
                followerId: viewerId,
              },
            },
          ],
        },
      },
    ]);

    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { MediaService } from '@/features/media/media.service';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PicturesDto, UserDto } from './dto/user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const userCreated = await this.userModel.create(createUserDto);
    return userCreated.toJSON();
  }

  async findAll({ skip, limit }: FindAllUsersDto): Promise<UserProfileDto[]> {
    let aggregate = await this.userModel.aggregate([
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

    aggregate = await this.userModel.populate(aggregate, [
      { path: 'pictures.profilePicture' },
      { path: 'pictures.coverPicture' },
    ]);

    const users: UserProfileDto[] = JSON.parse(JSON.stringify(aggregate));

    for (const user of users) {
      await this.downloadPictures(user.pictures);
    }

    return users;
  }

  async findOne(filter: {
    email?: string;
    googleId?: string;
    username?: string;
  }): Promise<UserDto | null> {
    const user = await this.userModel.findOne({
      ...(!!filter.email ? { email: filter.email } : {}),
      ...(!!filter.username ? { username: filter.username } : {}),
      ...(!!filter.googleId ? { 'oauth.googleId': filter.googleId } : {}),
    });

    return user?.toJSON() as UserDto | null;
  }

  async findOneById(userId: string): Promise<UserDto | null> {
    const user = await this.userModel.findById(userId);

    return user?.toJSON() as UserDto | null;
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userModel.findOne({ email });

    return user?.toJSON() as UserDto | null;
  }

  async findOneByGoogleId(googleId: string): Promise<UserDto | null> {
    const user = await this.userModel.findOne({ 'oauth.googleId': googleId });

    return user?.toJSON() as UserDto | null;
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

  async findInfoById(userId: string): Promise<UserInfoDto | null> {
    const _user = await this.userModel
      .findById(userId, {
        oauth: 0,
        password: 0,
      })
      .populate([{ path: 'pictures.profilePicture' }]);

    const user = _user?.toJSON() as UserInfoDto | null;

    if (user) {
      await this.downloadPictures(user.pictures);
    }

    return user;
  }

  async findProfileByUsername({
    username,
    requesterId,
  }: {
    username: string;
    requesterId?: string;
  }): Promise<UserProfileDto | null> {
    let aggregate = await this.userModel.aggregate([
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

    aggregate = await this.userModel.populate(aggregate, [
      { path: 'pictures.profilePicture' },
    ]);

    const user = JSON.parse(JSON.stringify(aggregate)).at(
      0,
    ) as UserProfileDto | null;

    if (user) {
      await this.downloadPictures(user.pictures);
    }

    return user;
  }

  async downloadPictures(pictures: PicturesDto): Promise<void> {
    if (pictures.profilePicture) {
      await this.mediaService.downloadMedia(pictures.profilePicture);
    }
  }
}

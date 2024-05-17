import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { ChatsRepository } from '@/modules/chats/infrastructure/repositories/chats.repository';
import { MediaService } from '@/modules/media/application/services/media.service';
import { StorageService } from '@/modules/media/application/services/storage.service';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/models/user';
import { UserData } from '@/modules/users/domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
} from '@/modules/users/domain/models/user-profile';

export class UsersRepository {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mediaService: MediaService,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const userDocument = await this.userModel.create(create);

    const user = new User(userDocument.toJSON());
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({
      _id: userId,
    });
    if (!userDocument) return null;

    const user = new User(userDocument.toJSON());
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({
      'oauth.googleId': googleId,
    });
    if (!userDocument) return null;

    const user = new User(userDocument.toJSON());
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({
      username,
    });
    if (!userDocument) return null;

    const user = new User(userDocument.toJSON());
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({
      email,
    });
    if (!userDocument) return null;

    const user = new User(userDocument.toJSON());
    return user;
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    const userDocument = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      update,
    );
    if (!userDocument) return null;

    const user = new User(userDocument.toJSON());
    return user;
  }

  async deleteUser(userId: string): Promise<User | null> {
    const userDocument = await this.userModel.findOneAndDelete({
      _id: userId,
    });
    if (!userDocument.value) return null;

    const user = new User(userDocument.value.toJSON());
    return user;
  }

  async getUserDataById(userId: string): Promise<UserData | null> {
    const userDocument = await this.userModel.findOne({
      _id: userId,
    });
    if (!userDocument) return null;

    const userData = new UserData({ ...userDocument.toJSON() });
    return userData;
  }

  async getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]> {
    const userDocuments = await this.userModel.find([
      {
        $match: {
          ids: {
            $in: filter.ids?.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
    ]);

    const usersProfileBasic = userDocuments.map(
      (userDocument) => new UserProfileBasic(userDocument.toJSON()),
    );

    return usersProfileBasic;
  }

  async getUserProfileByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfile | null> {
    const aggregateResults = await this.userModel.aggregate([
      { $match: { username } },
    ]);
    if (!aggregateResults) return null;

    return null;
  }
}

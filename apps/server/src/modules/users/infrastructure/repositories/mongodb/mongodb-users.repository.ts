import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CreateUserDto } from '../../../domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '../../../domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '../../../domain/dtos/update-user.dto';
import { User } from '../../../domain/models/user.model';
import { UserData } from '../../../domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
  UserProfileWithViewerData,
} from '../../../domain/models/user-profile.model';
import { IUsersRepository } from '../../../domain/repositories/users.repository';

export class MongodbUsersRepository implements IUsersRepository {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const document = await this.userModel.create(create);

    const user = new User(document.toJSON());
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const document = await this.userModel.findOne({
      _id: userId,
    });
    if (!document) return null;

    const user = new User(document.toJSON());
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const document = await this.userModel.findOne({
      'oauth.googleId': googleId,
    });
    if (!document) return null;

    const user = new User(document.toJSON());
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const document = await this.userModel.findOne({
      username,
    });
    if (!document) return null;

    const user = new User(document.toJSON());
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const document = await this.userModel.findOne({
      email,
    });
    if (!document) return null;

    const user = new User(document.toJSON());
    return user;
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    const document = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
      },
      update,
    );
    if (!document) return null;

    const user = new User(document.toJSON());
    return user;
  }

  async deleteUser(userId: string): Promise<User | null> {
    const document = await this.userModel.findOneAndDelete({
      _id: userId,
    });
    if (!document.value) return null;

    const user = new User(document.value.toJSON());
    return user;
  }

  async getUserData(userId: string): Promise<UserData | null> {
    const document = await this.userModel.findOne({
      _id: userId,
    });
    if (!document) return null;

    return new UserData(document.toJSON());
  }

  async getUsersProfileBasic({
    ids,
  }: GetUsersProfileBasicDto): Promise<UserProfileBasic[]> {
    const documents = await this.userModel.find();

    const usersProfileBasic = documents.map(
      (document) => new UserProfileBasic(document.toJSON()),
    );
    return usersProfileBasic;
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfile | null> {
    const document = await this.userModel.findOne({ username });
    if (!document) return null;

    return new UserProfileWithViewerData(document.toJSON());
  }
}

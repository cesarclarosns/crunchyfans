import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MediaService } from '@/modules/media/application/services/media.service';

import { ChatsService } from '../../../chats/chats.service';
import { PostsService } from '../../../posts/posts.service';
import { SubscriptionsService } from '../../../subscriptions/subscriptions.service';
import { CreateUserDto } from '../../domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '../../domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { User } from '../../domain/models/user.model';
import { UserData } from '../../domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
} from '../../domain/models/user-profile.model';
import { IUsersRepository } from '../../domain/repositories/users.repository';
import { IUsersService } from '../../domain/services/users.service';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectPinoLogger(UsersService.name) private readonly logger: PinoLogger,
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(create);
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.usersRepository.getUserById(userId);
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    return await this.usersRepository.getUserByGoogleId(googleId);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.getUserByEmail(email);
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    return await this.usersRepository.updateUser(userId, update);
  }

  async deleteUser(userId: string): Promise<User | null> {
    return await this.usersRepository.deleteUser(userId);
  }

  async getUserData(userId: string): Promise<UserData | null> {
    return await this.usersRepository.getUserData(userId);
  }

  async getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]> {
    return await this.usersRepository.getUsersProfileBasic(filter);
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfile> {
    return await this.usersRepository.getUserProfileWithViewerDataByUsername(
      username,
      viewerId,
    );
  }
}

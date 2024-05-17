import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { CreateUserDto } from '../../domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '../../domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { UserCreatedEvent, USERS_EVENTS } from '../../domain/events';
import { User } from '../../domain/models/user';
import { UserData } from '../../domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
} from '../../domain/models/user-profile';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectPinoLogger(UsersService.name) private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.createUser(create);

    // this.eventEmitter.emit(
    //   USERS_EVENTS.userCreated,
    //   new UserCreatedEvent(user.id),
    // );

    return user;
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
  ): Promise<UserProfile | null> {
    return null;
  }
}

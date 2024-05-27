import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { UserCreatedEvent, USERS_EVENTS } from '@/modules/users/domain/events';
import { User } from '@/modules/users/domain/models/user.model';
import { UserData } from '@/modules/users/domain/models/user-data.model';
import {
  UserProfile,
  UserProfileBasic,
} from '@/modules/users/domain/models/user-profile.model';
import { UsersRepository } from '@/modules/users/infrastructure/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectPinoLogger(UsersService.name) private readonly _logger: PinoLogger,
    private readonly _unitOfWork: MongoUnitOfWork,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _usersRepository: UsersRepository,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const dbContext = await this._unitOfWork.start();

    try {
      const user = await this._usersRepository.createUser(create, dbContext);

      this._eventEmitter.emit(
        USERS_EVENTS.userCreated,
        new UserCreatedEvent({ userId: user.id }),
      );

      await this._unitOfWork.commit(dbContext);

      return user;
    } catch (error) {
      await this._unitOfWork.rollback(dbContext);
      throw error;
    } finally {
      await this._unitOfWork.end(dbContext);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this._usersRepository.getUserById(userId);

    this._logger.debug('getUser done', user);
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    return await this._usersRepository.getUserByGoogleId(googleId);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this._usersRepository.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this._usersRepository.getUserByEmail(email);
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    return await this._usersRepository.updateUser(userId, update);
  }

  async deleteUser(userId: string): Promise<User | null> {
    return await this._usersRepository.deleteUser(userId);
  }

  async getUserData(userId: string): Promise<UserData | null> {
    return null;
    // return await this._usersRepository.getUserData(userId);
  }

  async getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]> {
    return await this._usersRepository.getUsersProfileBasic(filter);
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfile | null> {
    return null;
  }
}

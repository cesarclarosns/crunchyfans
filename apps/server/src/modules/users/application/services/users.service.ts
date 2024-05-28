import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { UserCreatedEvent, USERS_EVENTS } from '@/modules/users/domain/events';
import { User } from '@/modules/users/domain/models/user.model';
import { UserData } from '@/modules/users/domain/models/user-data.model';
import {
  UserProfileBasic,
  UserProfileWithViewerData,
} from '@/modules/users/domain/models/user-profile.model';
import { IUsersRepository } from '@/modules/users/domain/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectPinoLogger(UsersService.name) private readonly _logger: PinoLogger,
    @Inject(IUnitOfWorkFactory)
    private readonly _unitOfWorkFactory: IUnitOfWorkFactory,
    private readonly _eventEmitter: EventEmitter2,
    @Inject(IUsersRepository)
    private readonly _usersRepository: IUsersRepository,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const uow = this._unitOfWorkFactory.create();

    try {
      const user = await this._usersRepository.createUser(create, uow);

      this._eventEmitter.emit(
        USERS_EVENTS.userCreated,
        new UserCreatedEvent({ userId: user.id }),
      );

      await uow.commit();

      return user;
    } catch (error) {
      await uow.rollback();
      throw error;
    } finally {
      await uow.end();
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this._usersRepository.getUserById(userId);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this._usersRepository.getUserByUsername(username);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this._usersRepository.getUserByEmail(email);
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const user = await this._usersRepository.getUserByGoogleId(googleId);
    return user;
  }

  async updateUser(
    userId: string,
    update: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this._usersRepository.updateUser(userId, update);
    return user;
  }

  async deleteUser(userId: string): Promise<User | null> {
    const user = await this._usersRepository.deleteUser(userId);
    return user;
  }

  async getUserDataById(userId: string): Promise<UserData | null> {
    const userData = await this._usersRepository.getUserDataById(userId);
    return userData;
  }

  async getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]> {
    const usersProfileBasic =
      await this._usersRepository.getUsersProfileBasic(filter);
    return usersProfileBasic;
  }

  async getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfileWithViewerData | null> {
    const userProfileWithViewerData =
      await this._usersRepository.getUserProfileWithViewerDataByUsername(
        username,
        viewerId,
      );
    return userProfileWithViewerData;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { IUnitOfWorkFactory } from '@/common/domain/repositories/unit-of-work.factory';
import { MediaService } from '@/modules/media/application/services/media.service';
import { CreateAccountDto } from '@/modules/users/domain/dtos';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { CreateUserWithAccountDto } from '@/modules/users/domain/dtos/create-user-with-account';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/entities/user';
import { UserData } from '@/modules/users/domain/entities/user-data';
import {
  UserProfileBasic,
  UserProfileWithViewerData,
} from '@/modules/users/domain/entities/user-profile';
import { IAccountsRepository } from '@/modules/users/domain/repositories/accounts.repository';
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
    @Inject(IAccountsRepository)
    private readonly _accountsRepository: IAccountsRepository,
    private readonly _mediaService: MediaService,
  ) {}

  async createUser(create: CreateUserDto): Promise<User> {
    const uow = this._unitOfWorkFactory.create();
    await uow.start();

    try {
      const user = await this._usersRepository.createUser(create, uow);

      // this._eventEmitter.emit(
      //   USERS_EVENTS.userCreated,
      //   new UserCreatedEvent({ userId: user.id }),
      // );

      await uow.commit();

      return user;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async createUserWithAccount(create: CreateUserWithAccountDto): Promise<User> {
    const uow = this._unitOfWorkFactory.create();
    await uow.start();

    try {
      const user = await this._usersRepository.createUser(
        new CreateUserDto({
          email: create.email,
          name: create.name,
          username: create.username,
          ...(!!create.profilePicture && {
            profilePicture: create.profilePicture,
          }),
        }),
        uow,
      );

      const account = await this._accountsRepository.createAccount(
        new CreateAccountDto({
          provider: create.provider,
          providerAccountId: create.providerAccountId,
          userId: user.id,
        }),
        uow,
      );

      // Send event

      this._logger.debug({ account, user });

      await uow.commit();

      return user;
    } catch (error) {
      await uow.rollback();
      throw error;
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
    const account =
      await this._accountsRepository.getAccountByProviderAccountId(
        'google',
        googleId,
      );
    if (!account) return null;

    const user = await this._usersRepository.getUserById(account.userId);
    if (!user) return null;

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

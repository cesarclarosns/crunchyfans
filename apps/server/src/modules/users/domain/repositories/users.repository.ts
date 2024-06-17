import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work.factory';
import { CreateUserDto } from '@/modules/users/domain/dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '@/modules/users/domain/dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '@/modules/users/domain/dtos/update-user.dto';
import { User } from '@/modules/users/domain/entities/user';
import { UserData } from '@/modules/users/domain/entities/user-data';
import {
  UserProfileBasic,
  UserProfileWithViewerData,
} from '@/modules/users/domain/entities/user-profile';

export interface IUsersRepository {
  createUser(create: CreateUserDto, uow: IUnitOfWork): Promise<User>;

  getUserById(userId: string): Promise<User | null>;

  getUserByUsername(username: string): Promise<User | null>;

  getUserByEmail(email: string): Promise<User | null>;

  updateUser(userId: string, update: UpdateUserDto): Promise<User | null>;

  deleteUser(userId: string): Promise<User | null>;

  getUserDataById(userId: string): Promise<UserData | null>;

  getUsersProfileBasic(
    filter: GetUsersProfileBasicDto,
  ): Promise<UserProfileBasic[]>;

  getUserProfileWithViewerDataByUsername(
    username: string,
    viewerId: string,
  ): Promise<UserProfileWithViewerData | null>;
}

export const IUsersRepository = Symbol('IUsersRepository');

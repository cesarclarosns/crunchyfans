import { CreateUserDto } from '../dtos/create-user.dto';
import { GetUsersProfileBasicDto } from '../dtos/get-users-profile-basic.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../models/user.model';
import { UserData } from '../models/user-data.model';
import { UserProfile, UserProfileBasic } from '../models/user-profile.model';

export interface IUsersRepository {
  createUser: (create: CreateUserDto) => Promise<User>;

  getUserById: (userId: string) => Promise<User | null>;

  getUserByGoogleId: (googleId: string) => Promise<User | null>;

  getUserByUsername: (username: string) => Promise<User | null>;

  getUserByEmail: (email: string) => Promise<User | null>;

  updateUser: (userId: string, update: UpdateUserDto) => Promise<User | null>;

  deleteUser: (userId: string) => Promise<User | null>;

  getUserData: (userId: string) => Promise<UserData | null>;

  getUsersProfileBasic: (
    filter: GetUsersProfileBasicDto,
  ) => Promise<UserProfileBasic[]>;

  getUserProfileWithViewerDataByUsername: (
    username: string,
    viewerId: string,
  ) => Promise<UserProfile | null>;
}

export const IUsersRepository = Symbol('IUsersRepository');

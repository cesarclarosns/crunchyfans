import { IModel } from '@/common/domain/model';

import { UserDto } from '../dtos/user.dto';
import { UserStatus } from '../types/user-status';

export class User {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  hashedPassword: string;
  name: string;
  about: string;
  status: UserStatus;
  lastSeen: string;
  oauth: { googleId: string };
  pictures: { cover: string; pictures: string };
  isEmailVerified: boolean;

  constructor(model: User) {
    Object.assign(this, model);
  }
}
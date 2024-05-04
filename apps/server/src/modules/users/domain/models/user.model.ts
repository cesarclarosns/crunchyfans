import { IModel } from '@/common/domain/model';
import { Media } from '@/modules/media/domain/models/media.model';

import { UserStatus } from '../types/user-status';
import { UserDto } from '../dtos/user.dto';

export class User implements IModel {
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
  pictures: { cover: Media; pictures: Media };
  isEmailVerified: boolean;

  constructor(model: User) {
    Object.assign(this, model);
  }

  toDto() {
    return new UserDto({});
  }
}

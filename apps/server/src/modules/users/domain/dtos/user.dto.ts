import { Exclude } from 'class-transformer';

import { UserStatus } from '@/modules/users/domain/types/user-status';

export class UserDto {
  id: string;

  name: string;

  username: string;

  email: string;

  @Exclude()
  hashedPassword: string;

  about: string;

  lastSeen: string;

  status: UserStatus;

  createdAt: string;

  updatedAt: string;

  constructor(dto: Partial<UserDto>) {
    Object.assign(this, dto);
  }
}

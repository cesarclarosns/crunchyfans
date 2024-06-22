import { UserStatus } from '@/modules/users/domain/types/user-status';

export class User {
  id: string;
  username: string;
  email: string;
  hashedPassword: string;
  name: string;
  about: string;
  status: UserStatus;
  lastSeen: string;
  profilePicture: string;
  coverPicture: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(entity: User) {
    Object.assign(this, entity);
  }
}

import { Media } from '@/modules/media/domain/entities';
import { UserStatus } from '@/modules/users/domain/types/user-status';

export class UserData {
  id: string;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  about: string;
  profilePicture: Media;
  coverPicture: Media;
  isEmailVerified: boolean;

  constructor(entity: UserData) {
    Object.assign(this, entity);
  }
}

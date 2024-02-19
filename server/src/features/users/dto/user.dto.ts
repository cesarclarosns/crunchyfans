import { ObjectValues } from '@/common/types/object-values.type';
import { MediaDto } from '@/features/media/dto/media.dto';

import { USER_STATUS } from '../users.constants';

class Metadata {
  followersCount: number;
  followeesCount: number;
  subscribersCount: number;
}

class Pictures {
  coverPicture?: MediaDto;
  profilePicture?: MediaDto;
}

class Settings {
  status: ObjectValues<typeof USER_STATUS>;
}

class Subscription {
  price: number;
}

export class UserDto {
  _id: string;
  email: string;
  username: string;
  displayName: string;

  pictures?: Pictures;
  metadata?: Metadata;
  subscription: Subscription;
}

import { ObjectValues } from '@/common/types/object-values.type';
import { MediaDto } from '@/features/media/dto/media.dto';

import { USER_STATUS } from '../users.constants';

export class MetadataDto {
  subscribersCount: number;
}

export class PicturesDto {
  profilePicture?: MediaDto;
}

export class SettingsDto {
  status: ObjectValues<typeof USER_STATUS>;
}

export class OAuthDto {
  googleId?: string;
}

export class UserDto {
  _id: string;
  email: string;
  username: string;
  displayName: string;
  password: string;
  bio: string;
  lastConnection: string;

  oauth: OAuthDto;
  metadata: MetadataDto;
  settings: SettingsDto;
}

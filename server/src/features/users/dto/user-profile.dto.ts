import { PickType } from '@nestjs/mapped-types';

import { PicturesDto, UserDto } from './user.dto';

export class UserProfileDto extends PickType(UserDto, [
  '_id',
  'email',
  'username',
  'displayName',
  'bio',
  'lastConnection',
  'metadata',
]) {
  pictures: PicturesDto;
  hasSubscription: false;
}

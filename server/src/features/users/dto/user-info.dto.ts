import { PickType } from '@nestjs/mapped-types';

import { PicturesDto, UserDto } from './user.dto';

export class UserInfoDto extends PickType(UserDto, [
  '_id',
  'email',
  'username',
  'displayName',
  'bio',
  'lastConnection',
]) {
  pictures: PicturesDto;
}

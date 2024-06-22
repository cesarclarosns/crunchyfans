import { OmitType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UserDataDto extends OmitType(UserDto, []) {
  constructor(dto: Partial<UserDataDto>) {
    super(dto);
    Object.assign(this, dto);
  }
}

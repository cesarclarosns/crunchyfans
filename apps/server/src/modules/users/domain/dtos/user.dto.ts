import { Exclude } from 'class-transformer';

import { MediaDto } from '@/modules/media/domain/dtos/media.dto';
import { UserStatus } from '@/modules/users/domain/types/user-status';

export class PicturesDto {
  cover?: MediaDto;

  picture?: MediaDto;

  constructor({ cover, picture, ...partial }: Partial<PicturesDto>) {
    Object.assign(this, partial);

    if (cover) {
      this.cover = new MediaDto(cover);
    }
    if (picture) {
      this.picture = new MediaDto(picture);
    }
  }
}

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

  pictures: PicturesDto;

  createdAt: string;

  updatedAt: string;

  constructor({ pictures, ...partial }: Partial<UserDto>) {
    Object.assign(this, partial);

    if (pictures) this.pictures = new PicturesDto(pictures);
  }
}

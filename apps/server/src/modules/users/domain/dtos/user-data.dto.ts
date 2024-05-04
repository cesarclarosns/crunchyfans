import { PickType } from '@nestjs/swagger';

import { MediaDto } from '@/modules/media/domain/dtos/media.dto';

import { UserDto } from './user.dto';

class PicturesDto {
  profile?: MediaDto;
  cover?: MediaDto;

  constructor(partial: Partial<PicturesDto>) {
    Object.assign(this, partial);
  }
}

class NotificationsDataDto {
  notificationsCount: number;

  constructor(partial: Partial<NotificationsDataDto>) {
    Object.assign(this, partial);
  }
}

class ChatsDataDto {
  chatsCount: number;

  constructor(partial: Partial<ChatsDataDto>) {
    Object.assign(this, partial);
  }
}

export class UserDataDto extends PickType(UserDto, [
  'about',
  'id',
  'name',
  'username',
]) {
  pictures: PicturesDto;
  notificationsData: NotificationsDataDto;
  chatsData: ChatsDataDto;

  constructor({
    pictures,
    chatsData,
    notificationsData,
    ...partial
  }: Partial<UserDataDto>) {
    super(partial);

    Object.assign(this, partial);

    if (pictures) {
      this.pictures = new PicturesDto(pictures);
    }
    if (chatsData) {
      this.chatsData = new ChatsDataDto(chatsData);
    }
    if (notificationsData) {
      this.notificationsData = new NotificationsDataDto(notificationsData);
    }
  }
}

import { PickType } from '@nestjs/swagger';

import { MediaDto } from '@/modules/media/domain/dtos/media.dto';

import { UserDto } from './user.dto';

export class PicturesDto {
  profile?: MediaDto;
  cover?: MediaDto;

  constructor(partial: Partial<PicturesDto>) {
    Object.assign(this, partial);
  }
}

export class CollectionsDataDto {
  constructor(partial: Partial<CollectionsDataDto>) {
    Object.assign(this, partial);
  }
}

export class SubscriptionsDataDto {
  constructor(partial: Partial<SubscriptionsDataDto>) {
    Object.assign(this, partial);
  }
}

export class UserBasicProfileDto extends PickType(UserDto, [
  'about',
  'id',
  'lastSeen',
  'name',
  'username',
]) {
  pictures: PicturesDto;
  collectionsData: CollectionsDataDto;
  subscriptionsData: SubscriptionsDataDto;

  constructor({
    pictures,
    collectionsData,
    subscriptionsData,
    ...partial
  }: Partial<UserBasicProfileDto>) {
    super(partial);

    Object.assign(this, partial);

    if (pictures) {
      this.pictures = new PicturesDto(pictures);
    }
    if (collectionsData) {
      this.collectionsData = new CollectionsDataDto(collectionsData);
    }
    if (subscriptionsData) {
      this.subscriptionsData = new SubscriptionsDataDto(subscriptionsData);
    }
  }
}

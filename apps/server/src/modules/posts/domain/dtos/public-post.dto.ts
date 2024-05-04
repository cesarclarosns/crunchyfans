import { OmitType } from '@nestjs/swagger';

import { MediaDto } from '@/modules/media/domain/dtos/media.dto';

import { PostDto } from './post.dto';

export class PublicPost extends OmitType(PostDto, ['medias']) {
  medias: MediaDto[];
  isFree: boolean;
  isPaid: boolean;
  canView: boolean;

  isLiked: boolean;

  constructor(partial: Partial<PublicPost>) {
    super(partial);

    Object.assign(this, partial);
  }
}

export class PostWithViewerData extends PostDto {
  canView: boolean;
  isLiked: boolean;
}

export class MessageWithViewerData {
  canView: boolean;
}

export class UserProfileWithViewerData {}

import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { MediaDto } from '@/modules/media/domain/dtos/media.dto';

export class MessageDto {
  id: string;

  userId: string;

  chatId: string;

  content: string;

  medias: string[];

  createdAt: string;

  price: number;
}

export class PublicMessageDto extends OmitType(MessageDto, ['medias']) {
  medias: MediaDto[];

  isFree: boolean;

  canView: boolean;

  isRead: boolean;

  isSeen: boolean;
}

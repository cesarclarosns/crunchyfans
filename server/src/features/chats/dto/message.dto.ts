import { MediaDto } from '@/features/media/dto/media.dto';
import { UserInfoDto } from '@/features/users/dto/user-info.dto';

export class MessageDto {
  _id: string;
  userId: string;
  content: string;
  media: MediaDto[];
  createdAt: string;

  seenBy?: string[];
  user?: UserInfoDto;
}

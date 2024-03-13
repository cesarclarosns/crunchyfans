import { MediaDto } from '@/features/media/dto/media.dto';
import { UserInfoDto } from '@/features/users/dto/user-info.dto';

export class PostDto {
  _id: string;
  media: MediaDto[];
  content: string;
  createdAt: string;

  user?: UserInfoDto;
  isLiked?: boolean;
}

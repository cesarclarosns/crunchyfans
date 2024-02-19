import { MediaDto } from '@/features/media/dto/media.dto';
import { UserDto } from '@/features/users/dto/user.dto';

export class PostDto {
  _id: string;
  media: MediaDto[];
  content: string;
  createdAt: string;

  user: UserDto;

  isLiked?: boolean;
}

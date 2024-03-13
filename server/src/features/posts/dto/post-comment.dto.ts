import { UserDto } from '@/features/users/dto/user.dto';

export class PostCommentDto {
  _id: string;
  content: string;
  createdAt: string;

  user?: UserDto;
  isLiked?: boolean;
}

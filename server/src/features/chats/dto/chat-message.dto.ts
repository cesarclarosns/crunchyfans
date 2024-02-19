import { MediaDto } from '@/features/media/dto/media.dto';
import { UserDto } from '@/features/users/dto/user.dto';

export class ChatMessageDto {
  _id: string;
  userId: string;
  user: UserDto;
  content: string;
  media: MediaDto[];
  gifs: string[];
  createdAt: string;

  isSeen: boolean;
}

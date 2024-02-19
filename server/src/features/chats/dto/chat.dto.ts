import { UserDto } from '@/features/users/dto/user.dto';

import { ChatMessageDto } from './chat-message.dto';

export class ChatDto {
  _id: string;
  participants: UserDto[];
  message: ChatMessageDto;
}

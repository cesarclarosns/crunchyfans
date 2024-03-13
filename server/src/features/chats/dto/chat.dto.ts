import { UserInfoDto } from '@/features/users/dto/user-info.dto';

import { MessageDto } from './message.dto';

export class ChatDto {
  _id: string;
  participants: UserInfoDto[];
  lastMessage?: MessageDto;
}

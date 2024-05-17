import { MessageDto } from './message.dto';

export class ChatDto {
  id: string;
  withUser: string;
  participants: string[];
  lastMessage: MessageDto;
}

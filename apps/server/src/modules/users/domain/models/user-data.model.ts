import { UserChatsData } from '@/modules/chats/domain/models/user-chats-data.model';
import { Media } from '@/modules/media/domain/models/media.model';
import { UserNotificationsData } from '@/modules/notifications/domain/models/user-notifications-data.model';

export class UserData {
  id: string;
  username: string;
  name: string;
  pictures: { cover: Media; profile: Media };
  chatsData: UserChatsData;
  notificationsData: UserNotificationsData;

  constructor(model: UserData) {
    Object.assign(this, model);
  }
}

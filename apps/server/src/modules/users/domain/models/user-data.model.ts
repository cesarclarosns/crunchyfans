import { Media } from '@/modules/media/infrastructure/entities/media.entity';

export class UserData {
  id: string;
  username: string;
  pictures: { cover: Media; picture: Media };
  chatsData: {
    chatsCount: number;
  };
  notificationsData: {
    notificationsCount: number;
  };

  constructor(model: UserData) {
    Object.assign(this, model);
  }
}

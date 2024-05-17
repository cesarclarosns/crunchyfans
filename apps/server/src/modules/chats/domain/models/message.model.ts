import { Media } from '@/modules/media/domain/models/media.model';

export class MessageMedia extends Media {
  isFree: boolean;
}

export class Message {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  medias: MessageMedia[];
  price: number;
  createdAt: string;

  constructor(model: Message) {
    Object.assign(this, model);
  }
}

export class MessageWithViewerData extends Message {
  isRead: boolean;
  canViewMedias: boolean;

  constructor(model: MessageWithViewerData) {
    super(model);

    Object.assign(this, model);
  }
}

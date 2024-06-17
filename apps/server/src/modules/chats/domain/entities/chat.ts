export class Chat {
  id: string;
  participants: string[];
  lastMessageId: string;
  lastSenderId: string;

  constructor(model: Chat) {
    Object.assign(this, model);
  }
}

export class ChatWithViewerData {
  id: string;
  withUser: string;
  lastMessage: {
    id: string;
    createdAt: string;
    text: string;
    hasMedias: boolean;
    isRead: boolean;
  };

  constructor(model: ChatWithViewerData) {
    Object.assign(this, model);
  }
}

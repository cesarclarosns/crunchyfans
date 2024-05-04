export interface IChatsService {
  createChat: () => Promise<void>;

  getChats: () => Promise<void>;

  getChatById: () => Promise<void>;

  getChatByParticipants: () => Promise<void>;

  getMessageById: (messageId: string, viewerId: string) => Promise<void>;

  getMessages: (dto: any, viewerId: string) => Promise<void>;

  createMessage: () => Promise<void>;

  deleteMessage: () => Promise<void>;
}

export const IChatsService = Symbol('IChatsService');

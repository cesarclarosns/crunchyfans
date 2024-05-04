export interface IChatsRepository {
  createChat: () => void;
  findChats: () => void;
  findOneChat: () => void;

  createMessage: () => void;
  findMessages: () => void;
  updateMessage: () => void;
  findOneMessageById: () => void;
}

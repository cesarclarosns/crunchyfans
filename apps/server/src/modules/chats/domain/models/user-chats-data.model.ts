export class UserChatsData {
  unreadChatsCount: number;
  unreadChats: string[];

  constructor(model: UserChatsData) {
    Object.assign(this, model);
  }
}

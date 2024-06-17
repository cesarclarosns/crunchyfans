export class UserChats {
  unreadChatsCount: number;
  unreadChats: string[];

  constructor(model: UserChats) {
    Object.assign(this, model);
  }
}

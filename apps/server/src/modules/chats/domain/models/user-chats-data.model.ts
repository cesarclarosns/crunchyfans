export class UserChatsData {
  unreadChatsCount: number;

  constructor(model: UserChatsData) {
    Object.assign(this, model);
  }
}

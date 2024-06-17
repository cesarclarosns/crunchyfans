export class UserChat {
  userId: string;
  chatId: string;
  lastDeletedMessageId: string;
  lastReadMessageId: string;

  constructor(model: UserChat) {
    Object.assign(this, model);
  }
}

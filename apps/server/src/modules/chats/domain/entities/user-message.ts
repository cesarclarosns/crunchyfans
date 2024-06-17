export class UserMessage {
  userId: string;
  messageId: string;
  isPurchased: boolean;

  constructor(model: UserMessage) {
    Object.assign(this, model);
  }
}

export class MessageReadEvent {
  chatId: string;
  messageId: string;
  userId: string;

  constructor(ev: { chatId: string; messageId: string; userId: string }) {
    this.chatId = ev.chatId;
    this.messageId = ev.messageId;
    this.userId = ev.userId;
  }
}

export class ChatMessageCreatedEvent {
  chatId: string;
  messageId: string;

  constructor(ev: { chatId: string; messageId: string }) {
    this.chatId = ev.chatId;
    this.messageId = ev.messageId;
  }
}

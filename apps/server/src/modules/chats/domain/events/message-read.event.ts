export class MessageReadEvent {
  readonly messageId: string;
  readonly chatId: string;
  readonly userId: string;

  constructor(event: MessageReadEvent) {
    Object.assign(this, event);
  }
}

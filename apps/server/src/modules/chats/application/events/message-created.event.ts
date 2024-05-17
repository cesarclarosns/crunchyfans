export class MessageCreatedEvent {
  readonly chatId: string;
  readonly messageId: string;

  constructor(ev: MessageCreatedEvent) {
    Object.assign(this, ev);
  }
}

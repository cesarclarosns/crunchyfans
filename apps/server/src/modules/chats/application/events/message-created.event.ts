export class MessageCreatedEvent {
  readonly chatId: string;
  readonly messageId: string;

  constructor(event: MessageCreatedEvent) {
    Object.assign(this, event);
  }
}

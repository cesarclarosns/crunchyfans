export class MessageCreatedEvent {
  readonly messageId: string;

  constructor(ev: MessageCreatedEvent) {
    Object.assign(this, ev);
  }
}

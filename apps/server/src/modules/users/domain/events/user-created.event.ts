export class UserCreatedEvent {
  readonly userId: string;

  constructor(ev: UserCreatedEvent) {
    Object.assign(this, ev);
  }
}

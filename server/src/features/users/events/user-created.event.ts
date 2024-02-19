export class UserCreatedEvent {
  userId: string;
  email: string;

  constructor(ev: { userId: string; email: string }) {
    this.userId = ev.userId;
    this.email = ev.email;
  }
}

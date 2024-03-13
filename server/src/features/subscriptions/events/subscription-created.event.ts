export class SubscriptionCreatedEvent {
  userId: string;
  targetUserId: string;

  constructor(ev: { userId: string; targetUserId: string }) {
    this.userId = ev.userId;
    this.targetUserId = ev.targetUserId;
  }
}

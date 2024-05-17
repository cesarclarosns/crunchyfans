export class SubscriptionCreatedEvent {
  subscriberId: string;
  subscribeeId: string;

  constructor(ev: SubscriptionCreatedEvent) {
    Object.assign(this, ev);
  }
}

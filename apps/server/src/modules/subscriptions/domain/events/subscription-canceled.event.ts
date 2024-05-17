export class SubscriptionCanceledEvent {
  subscriberId: string;
  subscribeeId: string;

  constructor(ev: SubscriptionCanceledEvent) {
    Object.assign(this, ev);
  }
}

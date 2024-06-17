export class Subscription {
  subscriberId: string;
  subscribeeId: string;
  subscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;

  constructor(model: Subscription) {
    Object.assign(this, model);
  }
}

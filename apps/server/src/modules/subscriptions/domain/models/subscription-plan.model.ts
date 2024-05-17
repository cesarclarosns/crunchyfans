export class SubscriptionPlan {
  userId: string;
  price: number;
  bundles: {
    discount: number;
    duration: number;
  }[];
}

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

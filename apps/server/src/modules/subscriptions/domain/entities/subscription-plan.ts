export class SubscriptionPlan {
  userId: string;
  price: number;
  bundles: {
    discount: number;
    duration: number;
  }[];
}

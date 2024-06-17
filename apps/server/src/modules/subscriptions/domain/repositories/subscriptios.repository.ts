export interface ISubscriptionsRepository {
  createSubscription(): void;
  getSubscription(): void;
  updateSubscription(): void;
  deleteSubscription(): void;

  createSubscriptionPlan(): void;
  updateSubscriptionPlan(): void;
}

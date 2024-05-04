export class SubscriptionDto {
  id: string;
  stripeSubscriptionId: string;
  fromUser: string;
  toUser: string;
  startDate: string;
  endDate: string;
  renew: boolean;
}

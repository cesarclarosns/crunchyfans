export class BillingAccount {
  userId: string;
  stripeCustomerId: string;
  stripeAccountId: string;

  constructor(model: BillingAccount) {
    Object.assign(this, model);
  }
}

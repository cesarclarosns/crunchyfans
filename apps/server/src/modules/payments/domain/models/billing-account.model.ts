export class BillingAccount {
  userId: string;
  stripeCustomerId: string;
  stripeAccountId: string;

  constructor(billingAccount: BillingAccount) {
    Object.assign(this, billingAccount);
  }
}

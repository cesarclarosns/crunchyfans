export class Payment {
  id: string;
  payorId: string;
  payeeId: string;
  type: 'post' | 'message' | 'subscription';
  subscriptionId: string;
  messageId: string;
  postId: string;

  stripePaymentId: string;

  amount: number;
  vatAmount: number;
  vatPercentage: number;
  vatName: string;

  createdAt: string;
  updatedAt: string;

  constructor(model: Payment) {
    Object.assign(this, model);
  }
}

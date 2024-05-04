export interface IPaymentsRepository {
  createPayment: () => void;
  updatePayment: () => void;
  findPayments: () => void;
  findOnePaymentById: () => void;

  createBillingAccount: () => void;
  updateBillingAccount: () => void;
  findOneBillingAccount: () => void;
}

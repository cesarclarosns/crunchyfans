import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BillingAccount } from '../../domain/entities/billing.entity';
import { Payment } from '../../domain/entities/payment.entity';

export class PaymentsRepository {
  constructor(
    @InjectPinoLogger(PaymentsRepository.name)
    private readonly logger: PinoLogger,
    @InjectModel(BillingAccount.name)
    private billingAccBillingAccountModel: Model<BillingAccount>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async createPayment() {}
  async updatePayment(paymentId: string) {}
  async getPaymentById(paymentId: string) {}
  async getPaymentsByUserId(userId: string, filter) {}
}

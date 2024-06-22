import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoBillingAccount, MongoPayment } from '../entities';

export class MongoPaymentsRepository {
  constructor(
    @InjectPinoLogger(MongoPaymentsRepository.name)
    private readonly _logger: PinoLogger,
    @InjectModel(MongoBillingAccount.name)
    private _billingAccountModel: Model<MongoBillingAccount>,
    @InjectModel(MongoPayment.name) private paymentModel: Model<MongoPayment>,
  ) {}

  async createPayment() {}
  async updatePayment(paymentId: string) {}
  async getPaymentById(paymentId: string) {}
  async getPaymentsByUserId(userId: string, filter) {}
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { PaymentsService } from './application/services/payments.service';
import {
  BillingAccount,
  BillingAccountSchema,
} from './infrastructure/repositories/mongo/entities/billing.entity';
import { Payment, PaymentSchema } from './infrastructure/repositories/mongo/entities/payment.entity';
import { PaymentsController } from './presentation/controllers/payments.controller';

@Module({
  controllers: [PaymentsController],
  exports: [PaymentsService],
  imports: [
    MongooseModule.forFeature([
      { name: BillingAccount.name, schema: BillingAccountSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    UsersModule,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}

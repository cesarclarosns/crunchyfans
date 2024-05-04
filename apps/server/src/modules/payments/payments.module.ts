import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { Billing, BillingSchema } from './infrastructure/repositories/mongodb/entities/entities/billing.entity';
import { Payment, PaymentSchema } from './infrastructure/repositories/mongodb/entities/entities/payment.entity';
import { PaymentsController } from './infrastructure/controllers/payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  exports: [PaymentsService],
  imports: [
    MongooseModule.forFeature([
      { name: Billing.name, schema: BillingSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    UsersModule,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}

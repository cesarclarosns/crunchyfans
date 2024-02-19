import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { Billing, BillingSchema } from './entities/billing.entity';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
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

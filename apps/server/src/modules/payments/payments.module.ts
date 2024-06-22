import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { PaymentsService } from './application/services/payments.service';
import {
  MongoBillingAccount,
  MongoBillingAccountSchema,
  MongoPayment,
  MongoPaymentSchema,
} from './infrastructure/entities';
import { PaymentsController } from './presentation/controllers/payments.controller';

@Module({
  controllers: [PaymentsController],
  exports: [PaymentsService],
  imports: [
    MongooseModule.forFeature([
      { name: MongoBillingAccount.name, schema: MongoBillingAccountSchema },
      { name: MongoPayment.name, schema: MongoPaymentSchema },
    ]),
    UsersModule,
  ],
  providers: [PaymentsService],
})
export class PaymentsModule {}

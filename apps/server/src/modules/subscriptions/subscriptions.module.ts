import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from '@/modules/payments/payments.module';
import {
  MongoSubcriptionPlanSchema,
  MongoSubscription,
  MongoSubscriptionPlan,
  MongoSubscriptionSchema,
} from '@/modules/subscriptions/infrastructure/entities';
import { SubscriptionsController } from '@/modules/subscriptions/presentation/subscriptions.controller';

import { SubscriptionsService } from './application/services/subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  exports: [MongooseModule, SubscriptionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoSubscriptionPlan.name,
        schema: MongoSubcriptionPlanSchema,
      },
      { name: MongoSubscription.name, schema: MongoSubscriptionSchema },
    ]),
  ],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}

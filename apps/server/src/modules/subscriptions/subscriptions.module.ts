import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from '../payments/payments.module';
import {
  Subscription,
  SubscriptionSchema,
} from './infrastructure/entities/subscription.entity';
import {
  SubcriptionPlanSchema,
  SubscriptionPlan,
} from './infrastructure/entities/subscription-plan.entity';
import { SubscriptionsController } from './presentation/subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  exports: [MongooseModule, SubscriptionsService],
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubcriptionPlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}

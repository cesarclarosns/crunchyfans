import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionsService } from './application/services/subscriptions.service';
import {
  Subscription,
  SubscriptionSchema,
} from './infrastructure/repositories/mongo/entities/subscription.entity';
import {
  SubcriptionPlanSchema,
  SubscriptionPlan,
} from './infrastructure/repositories/mongo/entities/subscription-plan.entity';
import { SubscriptionsController } from './presentation/subscriptions.controller';

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

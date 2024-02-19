import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Subscription,
  SubscriptionSchema,
} from './entities/subscription.entity';
import {
  SubcriptionPlanSchema,
  SubscriptionPlan,
} from './entities/subscription-plan.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubcriptionPlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}

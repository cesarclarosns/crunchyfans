import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaymentsModule } from '../../payments/infrastructure/payments.module';
import { SubscriptionsService } from '../application/services/subscriptions.service';
import {
  Subscription,
  SubscriptionSchema,
} from '../domain/entities/subscription.entity';
import {
  SubcriptionPlanSchema,
  SubscriptionPlan,
} from '../domain/entities/subscription-plan.entity';
import { SubscriptionsController } from '../presentation/subscriptions.controller';

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

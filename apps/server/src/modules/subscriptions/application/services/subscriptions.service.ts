import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { PaymentsService } from '../../../payments/application/services/payments.service';
import { CreateSubscriptionDto } from '../../domain/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../domain/dtos/update-subscription.dto';
import { UpdateSubscriptionPlanDto } from '../../domain/dtos/update-subscription-plan.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectConnection() private readonly _connection: mongoose.Connection,
  ) {}

  // Subscriptions
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {}
  async findAllSubscriptions() {}
  async findOneSubscription() {}
  async updateSubscription() {}
  async deleteSubscription() {}

  // Subscription plans
  async updateSubscriptionPlan(
    filter: { userId: string },
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {}
}

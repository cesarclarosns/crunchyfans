import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}

  // Subscriptions
  async createSubscription() {}
  async findAllSubscriptions() {}
  async findOneSubscription() {}
  async updateSubscription() {}
  async deleteSubscription() {}

  // Subscription plans
  async updateSubscriptionPlan(
    filter: { userId: string },
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return await this.subscriptionPlanModel.findOneAndUpdate(
      {
        userId: filter.userId,
      },
      updateSubscriptionPlanDto,
      {
        new: true,
        upsert: true,
      },
    );
  }
}

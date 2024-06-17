import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { PaymentsService } from '../../../payments/application/services/payments.service';
import { CreateSubscriptionDto } from '../../domain/dtos/create-subscription.dto';
import { UpdateSubscriptionDto } from '../../domain/dtos/update-subscription.dto';
import { UpdateSubscriptionPlanDto } from '../../domain/dtos/update-subscription-plan.dto';
import { Subscription } from '../../infrastructure/repositories/mongo/entities/subscription.entity';
import { SubscriptionPlan } from '../../infrastructure/repositories/mongo/entities/subscription-plan.entity';

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
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const isPaidSubscription = !!createSubscriptionDto.price;

    if (isPaidSubscription) {
    } else {
      const subscriptionCreated = await this.subscriptionModel.create({
        fromUserId: createSubscriptionDto.fromUserId,
        toUserId: createSubscriptionDto.toUserId,
      });
    }
  }
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

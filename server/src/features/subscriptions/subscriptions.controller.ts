import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionsService } from './subscriptions.service';

/**
 * POST /subscriptions/platform-subscription/plans
 * PUT /subscriptions/plans
 * POST /subscriptions
 * /subscriptions/:subscriptionId
 */

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Put('plans')
  async createSubscriptionPlan(
    @Req() req: Request,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    const userId = req.user.sub;

    return await this.subscriptionsService.updateSubscriptionPlan(
      { userId },
      updateSubscriptionPlanDto,
    );
  }

  @Post()
  async createSubscription() {}
}

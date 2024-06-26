import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SubscriptionsService } from '../application/services/subscriptions.service';
import { CreateSubscriptionDto } from '../domain/dtos/create-subscription.dto';
import { UpdateSubscriptionPlanDto } from '../domain/dtos/update-subscription-plan.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    @InjectPinoLogger(SubscriptionsController.name)
    private readonly logger: PinoLogger,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  async createSubscription(
    @Req() req: Request,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const userId = req.user.sub;
  }

  @Get()
  async findAllSubscriptions(@Req() req: Request) {
    const userId = req.user.sub;
  }

  @Put('subscription-plan')
  async updateSubscriptionPlan(
    @Req() req: Request,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    const userId = req.user.sub;
  }
}

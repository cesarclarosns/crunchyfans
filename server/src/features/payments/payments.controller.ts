import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

import { config } from '@/config';
import { stripe } from '@/libs/stripe';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindAllPaymentsDto } from './dto/find-all-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment-methods')
  async getPaymentMethods(@Req() req: Request) {
    const userId = req.user.sub;

    return await this.paymentsService.getPaymentMethods({ userId });
  }

  @Get('publishable-key')
  async getPublishableKey() {
    return { publishableKey: config.APP.STRIPE_PUBLISHABLE_KEY };
  }

  @Post('webhook')
  async webhook(@Req() req: Request, @Body() body: any) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = '';

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        sig,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    console.log('event', event);

    switch (event.type) {
      case 'checkout.session.completed':
        switch (event.data.object.mode) {
          case 'setup':
            console.log('setup');
            break;
          case 'payment':
            console.log('payment');
            break;
          case 'subscription':
            console.log('subscription');
            break;
        }
        console.log('checkout.session.completed');
        break;

      case 'payment_intent.succeeded':
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return;
  }

  @Post('create-checkout-session/subscription')
  async createSubscriptionCheckoutSession(@Req() req: Request) {
    const userId = req.user.sub;

    return await this.paymentsService.createSubscriptionCheckoutSession({
      subscriptionPlan: {
        discount: 0.2,
        duration: 3,
        price: 5,
      },
      targetUserId: userId,
      userId,
    });
  }

  @Post('create-checkout-session/setup')
  async createSetupCheckoutSession(@Req() req: Request) {
    const userId = req.user.sub;

    return await this.paymentsService.createSetupCheckoutSession({ userId });
  }

  @Post('create-checkout-session/payment')
  async createPaymentCheckoutSession(@Req() req: Request) {
    const userId = req.user.sub;
  }

  @Post('create-payment-intent/payment')
  async createSubscriptionPaymentIntent(@Req() req: Request) {
    const userId = req.user.sub;
  }

  @Post()
  async createPayment(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    const userId = req.user.sub;

    return await this.paymentsService.createPayment(createPaymentDto);
  }

  @Get()
  async findAllPayments(@Query() findAllPaymentsDto: FindAllPaymentsDto) {
    return await this.paymentsService.findAllPayments(findAllPaymentsDto);
  }

  @Get(':paymentId')
  async findOnePayment(@Param('paymentId') paymentId: string) {
    return await this.paymentsService.findOnePayment({ paymentId });
  }

  @Patch(':paymentId')
  async updatePayment(
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentsService.updatePayment(
      { paymentId },
      updatePaymentDto,
    );
  }

  @Delete(':paymentId')
  async removePayment(
    @Req() req: Request,
    @Param('paymentId') paymentId: string,
  ) {
    const userId = req.user.sub;

    return await this.paymentsService.deletePayment({ paymentId });
  }
}

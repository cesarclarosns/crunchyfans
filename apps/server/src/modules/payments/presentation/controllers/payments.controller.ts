import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

import { stripe } from '../../application/libs/stripe';
import { PaymentsService } from '../../application/services/payments.service';
import { CreatePaymentDto } from '../../domain/dtos/create-payment.dto';
import { CreatePayoutDto } from '../../domain/dtos/create-payout.dto';
import { FindAllPaymentsDto } from '../../domain/dtos/find-all-payments.dto';
import { UpdatePaymentDto } from '../../domain/dtos/update-payment.dto';

/**
 * GET /payments/:paymentId
 * GET /payments
 * GET /payments/methods
 * POST /payments?type=post&id=123
 *
 *
 *
 */

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('webhook')
  // @HttpCode(HttpStatus.OK)
  // async webhook(@Req() req: Request, @Body() body: any) {
  //   const sig = req.headers['stripe-signature'];
  //   const endpointSecret = '';

  //   let event: Stripe.Event;

  //   try {
  //     event = await stripe.webhooks.constructEventAsync(
  //       body,
  //       sig!,
  //       endpointSecret,
  //     );
  //   } catch (err) {
  //     throw new BadRequestException(`Webhook Error: ${err.message}`);
  //   }

  //   await this.paymentsService.webhook(event);
  // }

  // @Post('create-setup-intent')
  // async createSetupIntent(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.createSetupIntent({ userId });
  // }

  // @Post('create-account-onboarding-link')
  // async createAccountOnboardingLink(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.createAccountOnboardingLink({ userId });
  // }

  // @Post('create-payout')
  // async createPayout(
  //   @Req() req: Request,
  //   @Body() createPayoutDto: CreatePayoutDto,
  // ) {
  //   const userId = req.user.sub;

  //   createPayoutDto.userId = userId;

  //   return await this.paymentsService.createPayout(createPayoutDto);
  // }

  // @Get('list-payment-methods')
  // async listPaymentMethods(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.listPaymentMethods({ userId });
  // }

  // @Get('list-external-accounts')
  // async listExternalAccounts(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.listExternalAccounts({ userId });
  // }

  // @Get('retrieve-balance')
  // async retrieveBalance(@Req() req: Request) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.retrieveBalance({ userId });
  // }

  // @Post()
  // async createPayment(
  //   @Req() req: Request,
  //   @Body() createPaymentDto: CreatePaymentDto,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.createPayment(createPaymentDto);
  // }

  // @Get()
  // async findAllPayments(@Query() findAllPaymentsDto: FindAllPaymentsDto) {
  //   return await this.paymentsService.findAllPayments(findAllPaymentsDto);
  // }

  // @Get(':paymentId')
  // async findOnePayment(@Param('paymentId') paymentId: string) {
  //   return await this.paymentsService.findOnePayment({ paymentId });
  // }

  // @Patch(':paymentId')
  // async updatePayment(
  //   @Param('paymentId') paymentId: string,
  //   @Body() updatePaymentDto: UpdatePaymentDto,
  // ) {
  //   return await this.paymentsService.updatePayment(
  //     { paymentId },
  //     updatePaymentDto,
  //   );
  // }

  // @Delete(':paymentId')
  // async removePayment(
  //   @Req() req: Request,
  //   @Param('paymentId') paymentId: string,
  // ) {
  //   const userId = req.user.sub;

  //   return await this.paymentsService.deletePayment({ paymentId });
  // }
}

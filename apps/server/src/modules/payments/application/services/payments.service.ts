import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, set } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import Stripe from 'stripe';

import { UsersService } from '../../../users/application/services/users.service';
import { BillingDto } from '../../domain/dtos/billing.dto';
import { CreatePaymentDto } from '../../domain/dtos/create-payment.dto';
import { CreatePayoutDto } from '../../domain/dtos/create-payout.dto';
import { FindAllPaymentsDto } from '../../domain/dtos/find-all-payments.dto';
import { SetupIntentDto } from '../../domain/dtos/setup-intent.dto';
import { UpdatePaymentDto } from '../../domain/dtos/update-payment.dto';
import { stripe } from '../libs/stripe';
// stripe.subscriptions.create({
//   collection_method: 'charge_automatically',
// });
// stripe.subscriptions.retrieve('').then((subscription) => {
//   const invoice = subscription.latest_invoice as Stripe.Invoice;
//   const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
//   paymentIntent.status == '';
// });

@Injectable()
export class PaymentsService {
  constructor(
    @InjectPinoLogger(PaymentsService.name) private readonly logger: PinoLogger,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly usersService: UsersService,
  ) {}

  // // Stripe

  // async webhook(event: Stripe.Event) {
  //   switch (event.type) {
  //     case 'customer.subscription.created':
  //       break;
  //     case 'payment_intent.succeeded':
  //       break;
  //     default:
  //       console.log(`Unhandled event type ${event.type}`);
  //   }

  //   return;
  // }

  // async createSetupIntent({
  //   userId,
  // }: {
  //   userId: string;
  // }): Promise<SetupIntentDto> {
  //   const billing = await this.findOrCreateBilling({ userId });

  //   const setupIntent = await stripe.setupIntents.create({
  //     customer: billing.stripeCustomerId,
  //     payment_method_types: ['card'],
  //   });

  //   return { clientSecret: setupIntent.client_secret! };
  // }

  // async listPaymentMethods({ userId }: { userId: string }) {
  //   const billing = await this.findOrCreateBilling({ userId });

  //   const paymentMethos = await stripe.customers.listPaymentMethods(
  //     billing.stripeCustomerId,
  //     {
  //       type: 'card',
  //     },
  //   );

  //   return paymentMethos.data.map((paymentMethod) => {
  //     return paymentMethod;
  //   });
  // }

  // async createAccountOnboardingLink({
  //   userId,
  // }: {
  //   userId: string;
  // }): Promise<{ url: string }> {
  //   const billing = await this.findOrCreateBilling({ userId });

  //   const accountLink = await stripe.accountLinks.create({
  //     account: billing.stripeAccountId,
  //     collection_options: {
  //       fields: 'eventually_due',
  //     },
  //     refresh_url: `${settings.APP.DOMAIN}/my/payments/bank_account`,
  //     return_url: `${settings.APP.DOMAIN}/my/payments/bank_account`,
  //     type: 'account_onboarding',
  //   });

  //   return { url: accountLink.url };
  // }

  // async createPayout(createPayoutDto: CreatePayoutDto) {
  //   const billing = await this.findOrCreateBilling({
  //     userId: createPayoutDto.userId,
  //   });

  //   return await stripe.payouts.create(
  //     { amount: createPayoutDto.amount, currency: 'usd' },
  //     { stripeAccount: billing.stripeAccountId },
  //   );
  // }

  // async createSubscription({
  //   fromUserId,
  //   toUserId,
  //   paymentMethodId,
  //   price,
  // }: {
  //   fromUserId: string;
  //   toUserId: string;
  //   paymentMethodId: string;
  //   price: number;
  // }) {
  //   // const [fromBilling, toBilling] = await Promise.all([
  //   //   this.findOrCreateBilling({ userId: fromUserId }),
  //   //   this.findOrCreateBilling({ userId: toUserId }),
  //   // ]);

  //   // const [fromUser, toUser] = await Promise.all([
  //   //   this.usersService.findOneUserById(fromUserId),
  //   //   this.usersService.findOneUserById(toUserId),
  //   // ]);

  //   // const product = `Subscription to @${toUser!.username}`;

  //   // const subscription = await stripe.subscriptions.create(
  //   //   {
  //   //     application_fee_percent: 20,
  //   //     collection_method: 'charge_automatically',
  //   //     customer: fromBilling.stripeCustomerId,
  //   //     default_payment_method: '',
  //   //     items: [
  //   //       {
  //   //         price_data: {
  //   //           currency: 'usd',
  //   //           product,
  //   //           recurring: {
  //   //             interval: 'month',
  //   //             interval_count: 1,
  //   //           },
  //   //           unit_amount: 200,
  //   //         },
  //   //       },
  //   //     ],
  //   //     metadata: {
  //   //       fromUserId,
  //   //       toUserId,
  //   //     },
  //   //   },
  //   //   { stripeAccount: toBilling.stripeAccountId },
  //   // );

  //   // return subscription;
  // }

  // async retrieveBalance({ userId }: { userId: string }) {
  //   const billing = await this.findOrCreateBilling({ userId });

  //   return await stripe.balance.retrieve({
  //     stripeAccount: billing.stripeAccountId,
  //   });
  // }

  // async listExternalAccounts({ userId }: { userId: string }) {
  //   const billing = await this.findOrCreateBilling({ userId });

  //   return await stripe.accounts.listExternalAccounts(billing.stripeAccountId);
  // }

  // // Payments

  // async createPayment(createPaymentDto: CreatePaymentDto) {
  //   return await this.paymentModel.create(createPaymentDto);
  // }

  // async findAllPayments(findAllPaymentsDto: FindAllPaymentsDto) {
  //   console.log(findAllPaymentsDto);
  //   return await this.paymentModel.find();
  // }

  // async findOnePayment(filter: { paymentId: string }) {
  //   return await this.paymentModel.find({ _id: filter.paymentId });
  // }

  // async updatePayment(
  //   filter: { paymentId: string },
  //   updatePaymentDto: UpdatePaymentDto,
  // ) {
  //   return await this.paymentModel.updateOne(
  //     { _id: filter.paymentId },
  //     updatePaymentDto,
  //   );
  // }

  // async deletePayment(filter: { paymentId: string }) {
  //   return await this.paymentModel.deleteOne({ _id: filter.paymentId });
  // }

  // // Billing

  // async findOrCreateBilling({
  //   userId,
  // }: {
  //   userId: string;
  // }): Promise<BillingDto> {
  //   let billing = await this.billingModel.findOne({ userId });

  //   if (!billing) {
  //     const user = await this.usersService.findOneUserById(userId);

  //     if (!user) throw new BadRequestException('User not found');

  //     const [customer, account] = await Promise.all([
  //       stripe.customers.create({
  //         email: user.email,
  //         metadata: { userId },
  //         name: user.name,
  //       }),
  //       stripe.accounts.create({
  //         email: user.email,
  //         metadata: { userId },
  //         type: 'express',
  //       }),
  //     ]);

  //     billing = await this.billingModel.findOneAndUpdate(
  //       {
  //         userId,
  //       },
  //       {
  //         $setOnInsert: {
  //           stripeAccountId: account.id,
  //           stripeCustomerId: customer.id,
  //         },
  //       },
  //       { new: true, upsert: true },
  //     );
  //   }

  //   return billing!;
  // }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { stripe } from '@/libs/stripe';

import { AUTH_EVENTS } from '../auth/events';
import { UsersService } from '../users/users.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindAllPaymentsDto } from './dto/find-all-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Billing } from './entities/billing.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Billing.name) private billingModel: Model<Billing>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private readonly usersService: UsersService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return await this.paymentModel.create(createPaymentDto);
  }

  async findAllPayments(findAllPaymentsDto: FindAllPaymentsDto) {
    console.log(findAllPaymentsDto);
    return await this.paymentModel.find();
  }

  async findOnePayment(filter: { paymentId: string }) {
    return await this.paymentModel.find({ _id: filter.paymentId });
  }

  async updatePayment(
    filter: { paymentId: string },
    updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentModel.updateOne(
      { _id: filter.paymentId },
      updatePaymentDto,
    );
  }

  async deletePayment(filter: { paymentId: string }) {
    return await this.paymentModel.deleteOne({ _id: filter.paymentId });
  }

  // Billing

  async findOrCreateBilling({ userId }: { userId: string }) {
    let billing = await this.billingModel.findOne({ userId });

    if (!billing) {
      const user = await this.usersService.findOneById(userId);

      const [customer, account] = await Promise.all([
        stripe.customers.create({
          email: user.email,
          metadata: { userId },
          name: user.displayName,
        }),
        stripe.accounts.create({
          email: user.email,
          metadata: { userId },
        }),
      ]);

      billing = await this.billingModel.findOneAndUpdate(
        {
          userId,
        },
        {
          $setOnInsert: {
            stripeAccountId: account.id,
            stripeCustomerId: customer.id,
          },
        },
        { new: true, upsert: true },
      );
    }

    return billing;
  }

  // async createSubscriptionPayment({
  //   userId,
  //   targetUserId,
  // }: {
  //   userId: string;
  //   targetUserId: string;
  // }) {
  //   const [billingUser, billingTargetUser] = await Promise.all([
  //     this.findOrCreateBilling({ userId }),
  //     this.findOrCreateBilling({ userId: targetUserId }),
  //   ]);

  //   const subscription = await stripe.subscriptions.create(
  //     {
  //       customer: billingUser.stripeCustomerId,
  //       items: [
  //         {
  //           price_data: {
  //             currency: 'usd',
  //             product: 'Subscription to @${}',
  //             recurring: {
  //               interval: 'month',
  //               interval_count: 1,
  //             },
  //             unit_amount: 5,
  //           },
  //         },
  //       ],
  //     },
  //     { stripeAccount: billingTargetUser.stripeAccountId },
  //   );
  // }

  async createSubscriptionCheckoutSession({
    userId,
    targetUserId,
    subscriptionPlan,
  }: {
    userId: string;
    targetUserId: string;
    subscriptionPlan: {
      price: number;
      discount: number;
      duration: number;
    };
  }) {
    const [billingUser, billingTargetUser, targetUser] = await Promise.all([
      this.findOrCreateBilling({ userId }),
      this.findOrCreateBilling({ userId: targetUserId }),
      this.usersService.findOneById(targetUserId),
    ]);

    const checkoutSession = await stripe.checkout.sessions.create(
      {
        cancel_url: 'http://localhost:3000/cancel',
        customer: billingUser.stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Subscription to @${targetUser.username}`,
              },
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
              unit_amount:
                subscriptionPlan.price * 100 * (1 - subscriptionPlan.discount),
            },
            quantity: 3,
          },
        ],
        mode: 'subscription',
        payment_method_types: ['card'],
        success_url:
          'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      },
      {
        stripeAccount: billingTargetUser.stripeAccountId,
      },
    );

    return checkoutSession;
  }

  async createSetupCheckoutSession({ userId }: { userId: string }) {
    const billing = await this.findOrCreateBilling({ userId });

    return await stripe.checkout.sessions.create(
      {
        cancel_url: 'http://localhost:3000/cancel',
        currency: 'usd',
        customer: billing.stripeCustomerId,
        mode: 'setup',
        payment_method_types: ['card', 'link'],
        success_url:
          'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      },
      { stripeAccount: '' },
    );
  }

  async createPaymentCheckoutSession() {}

  async createSubscriptionPaymentIntent() {
    // return await stripe.subscriptions.create();
    // return await stripe.subscriptions.create({
    //   payment_settings: {
    //     payment_method_options: {
    //       card: '',
    //     },
    //   },
    // });
    // return await stripe.paymentIntents.create({
    //   amount: 5,
    //   currency: '',
    //   customer: '',
    //   payment_method: '',
    // });
  }

  async getPaymentMethods({ userId }: { userId: string }) {
    const billing = await this.findOrCreateBilling({ userId });
    return await stripe.customers.listPaymentMethods(billing.stripeCustomerId);
  }
}

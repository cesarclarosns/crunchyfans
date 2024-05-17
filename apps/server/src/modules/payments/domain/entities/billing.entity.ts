import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'billingAccount', versionKey: false })
export class BillingAccount {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: string;

  @Prop({
    required: true,
    type: String,
  })
  stripeCustomerId: string;

  @Prop({
    required: true,
    type: String,
  })
  stripeAccountId: string;
}

export const BillingAccountSchema =
  SchemaFactory.createForClass(BillingAccount);

BillingAccountSchema.index({ userId: 1 }, { unique: true });

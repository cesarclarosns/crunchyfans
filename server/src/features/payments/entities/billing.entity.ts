import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';

@Schema({ collection: 'billing', versionKey: false })
export class Billing {
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

export const BillingSchema = SchemaFactory.createForClass(Billing);

BillingSchema.index({ userId: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'subscriptionPlans',
  versionKey: false,
})
export class SubscriptionPlan extends Document {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    default: 0,
    required: true,
    type: Number,
  })
  price: number;
}

export const SubcriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

SubcriptionPlanSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

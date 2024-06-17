import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

class SubscriptionPlanBundle {
  @Prop({ required: true, type: Number })
  discount: number;

  @Prop({ required: true, type: Number })
  duration: number;
}

const SubscriptionPlanBundleSchema = SchemaFactory.createForClass(
  SubscriptionPlanBundle,
);

@Schema({
  collection: 'subscriptionPlan',
  versionKey: false,
})
export class SubscriptionPlan extends Document {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
  })
  userId: string;

  @Prop({
    default: 0,
    required: true,
    type: Number,
  })
  price: number;

  @Prop({
    default: [],
    required: true,
    type: [SubscriptionPlanBundleSchema],
  })
  bundles: SubscriptionPlanBundle[];
}

export const SubcriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

SubcriptionPlanSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

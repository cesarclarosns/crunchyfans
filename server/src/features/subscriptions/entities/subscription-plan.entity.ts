import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  versionKey: false,
})
class Bundle {
  @Prop({ required: true, type: Number })
  discount: number;

  // Duration period in months
  @Prop({ required: true, type: Number })
  duration: number;
}

const BundleSchema = SchemaFactory.createForClass(Bundle);

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

  @Prop({
    default: [],
    type: [BundleSchema],
  })
  bundles: Bundle[];
}

export const SubcriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

SubcriptionPlanSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

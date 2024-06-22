import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ _id: false, versionKey: false })
class MongoSubscriptionPlanBundle {
  @Prop({ required: true, type: Number })
  discount: number;

  @Prop({ required: true, type: Number })
  duration: number;
}

const MongoSubscriptionPlanBundleSchema = SchemaFactory.createForClass(
  MongoSubscriptionPlanBundle,
);

@Schema({
  collection: 'subscriptionPlan',
  versionKey: false,
})
export class MongoSubscriptionPlan extends Document {
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
    type: [MongoSubscriptionPlanBundleSchema],
  })
  bundles: MongoSubscriptionPlanBundle[];
}

export const MongoSubcriptionPlanSchema = SchemaFactory.createForClass(
  MongoSubscriptionPlan,
);

MongoSubcriptionPlanSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'subscription',
  id: false,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.subscriberId = ret.subscriberId.toString();
      ret.subscribeeId = ret.subscribeeId.toString();

      return ret;
    },
  },
  versionKey: false,
})
export class Subscription extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  subscriberId: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  subscribeeId: string;

  @Prop({ type: String })
  subscriptionId: string;

  @Prop({ type: String })
  currentPeriodEnd: string;

  @Prop({ type: String })
  currentPeriodStart: string;

  @Prop({ type: String })
  status: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({
  subscriptionId: 1,
});

SubscriptionSchema.index(
  {
    subscribeeId: 1,
    subscriberId: 1,
  },
  { unique: true },
);

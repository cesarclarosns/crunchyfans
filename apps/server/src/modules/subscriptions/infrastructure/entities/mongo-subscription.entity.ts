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
export class MongoSubscription extends Document {
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

export const MongoSubscriptionSchema =
  SchemaFactory.createForClass(MongoSubscription);

MongoSubscriptionSchema.index({
  subscriptionId: 1,
});

MongoSubscriptionSchema.index(
  {
    subscribeeId: 1,
    subscriberId: 1,
  },
  { unique: true },
);

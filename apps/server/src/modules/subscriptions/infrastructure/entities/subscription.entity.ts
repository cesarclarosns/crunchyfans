import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'subscription',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.subscriberId = ret.subscriberId.toString();
      ret.subscribeeId = ret.subscribeeId.toString();

      delete ret._id;

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
  stripeSubscriptionId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index(
  {
    subscribeeId: 1,
    subscriberId: 1,
  },
  { unique: true },
);

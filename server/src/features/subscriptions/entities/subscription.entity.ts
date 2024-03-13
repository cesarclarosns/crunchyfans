import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'subscriptions',
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
  versionKey: false,
})
export class Subscription {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  targetUserId: mongoose.Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index(
  {
    targetUserId: 1,
    userId: 1,
  },
  { unique: true },
);

export interface Subs {
  userId: string;
  targetUserId: string;
  startDate: string;
  endDate: string;
}

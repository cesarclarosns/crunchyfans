import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userSubscriptionsData',
  id: false,
  toJSON: {
    transform(doc, ret) {
      ret.userId = ret.userId.toString();

      return ret;
    },
  },
  versionKey: false,
})
export class UserSubscriptionsData extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: string;

  @Prop({ default: 0, required: true, type: Number })
  subscribersCount: number;

  @Prop({ default: 0, required: true, type: Number })
  subscribeesCount: number;
}

export const UserSubscriptionsDataSchema = SchemaFactory.createForClass(
  UserSubscriptionsData,
);

UserSubscriptionsDataSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

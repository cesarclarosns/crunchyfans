import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'payment',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      ret.fromUserId = ret.fromUserId.toString();
      ret.toUserId = ret.toUserId.toString();
      return ret;
    },
  },
  versionKey: false,
})
export class MongoPayment extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  fromUserId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  toUserId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  product: string;
}

export const MongoPaymentSchema = SchemaFactory.createForClass(MongoPayment);

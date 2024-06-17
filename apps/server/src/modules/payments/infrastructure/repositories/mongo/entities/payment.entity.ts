import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  versionKey: false,
})
class Metadata {}

const MetadataSchema = SchemaFactory.createForClass(Metadata);

@Schema({
  collection: 'payment',
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.fromUserId = ret.fromUserId.toString();
      ret.toUserId = ret.toUserId.toString();

      delete ret._id;

      return ret;
    },
  },
  versionKey: false,
})
export class Payment extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  fromUserId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  toUserId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  product: string;

  @Prop({ type: MetadataSchema })
  metadata: Metadata;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

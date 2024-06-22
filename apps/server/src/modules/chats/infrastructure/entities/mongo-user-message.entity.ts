import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userMessage',
  id: false,
  versionKey: false,
})
export class MongoUserMessage extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: Boolean })
  isPurchased: boolean;
}

export const MongoUserMessageSchema =
  SchemaFactory.createForClass(MongoUserMessage);

MongoUserMessageSchema.index(
  {
    messageId: 1,
    userId: 1,
  },
  { unique: true },
);

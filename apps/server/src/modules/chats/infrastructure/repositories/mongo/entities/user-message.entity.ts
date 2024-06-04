import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userMessage',
  id: false,
  versionKey: false,
})
export class UserMessage extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: Boolean })
  isPurchased: boolean;
}

export const UserMessageSchema = SchemaFactory.createForClass(UserMessage);

UserMessageSchema.index(
  {
    messageId: 1,
    userId: 1,
  },
  { unique: true },
);

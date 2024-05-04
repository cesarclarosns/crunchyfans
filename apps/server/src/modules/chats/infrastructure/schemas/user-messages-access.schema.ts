import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userMessageAccess',
  id: false,
  versionKey: false,
})
export class UserMessageAccess extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Schema.Types.ObjectId;
}

export const UserMessageAccessSchema =
  SchemaFactory.createForClass(UserMessageAccess);

UserMessageAccessSchema.index(
  {
    messageId: 1,
    userId: 1,
  },
  { unique: true },
);

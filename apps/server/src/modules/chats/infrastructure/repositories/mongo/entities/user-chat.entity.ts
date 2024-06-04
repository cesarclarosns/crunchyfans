import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userChat',
  id: false,
  versionKey: false,
})
export class UserChat extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  chatId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  lastDeletedMessageId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  lastReadMessageId: mongoose.Types.ObjectId;
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);

UserChatSchema.index(
  {
    chatId: 1,
    userId: 1,
  },
  { unique: true },
);

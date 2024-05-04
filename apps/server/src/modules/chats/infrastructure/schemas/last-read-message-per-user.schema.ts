import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'lastReadMessagePerUser',
  id: false,
  versionKey: false,
})
export class LastReadMessagePerUser extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  chatId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Schema.Types.ObjectId;
}

export const LastReadMessagePerUserSchema = SchemaFactory.createForClass(
  LastReadMessagePerUser,
);

LastReadMessagePerUserSchema.index(
  {
    chatId: 1,
    messageId: 1,
    userId: 1,
  },
  { unique: true },
);

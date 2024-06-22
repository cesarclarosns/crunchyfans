import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userChat',
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  versionKey: false,
})
export class MongoUserChat extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  chatId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  lastDeletedMessageId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  lastReadMessageId: mongoose.Types.ObjectId;
}

export const MongoUserChatSchema = SchemaFactory.createForClass(MongoUserChat);

MongoUserChatSchema.index(
  {
    chatId: 1,
    userId: 1,
  },
  { unique: true },
);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  _id: false,
  collection: 'lastReadMessagePerUser',
  id: false,
  timestamps: false,
  versionKey: false,
})
export class LastReadMessagePerUser extends Document {
  @Factory((faker, ctx) => ctx!.chatId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  chatId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.messageId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;
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

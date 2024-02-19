import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  collection: 'lastReadChatMessagePerUser',
  timestamps: false,
})
export class LastReadChatMessagePerUser extends Document {
  @Factory((faker, ctx) => ctx.userId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.chatId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  chatId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.messageId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  messageId: mongoose.Types.ObjectId;
}

export const LastReadChatMessagePerUserSchema = SchemaFactory.createForClass(
  LastReadChatMessagePerUser,
);

LastReadChatMessagePerUserSchema.index(
  {
    chatId: 1,
    messageId: 1,
    userId: 1,
  },
  { unique: true },
);

export type TLastReadChatMessagePerUserFilterQuery =
  FilterQuery<LastReadChatMessagePerUser>;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  collection: 'chat',
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();

      delete ret._id;

      return ret;
    },
  },
  versionKey: false,
})
export class Chat extends Document {
  @Factory((faker, ctx) => ctx!.participants)
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  participants: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  lastMessageId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  lastSenderId: mongoose.Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

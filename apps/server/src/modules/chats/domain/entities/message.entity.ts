import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Media } from '@/modules/media/domain/entities/media.entity';
import { User } from '@/modules/users/infrastructure/repositories/entities/user.entity';

@Schema({ _id: false, versionKey: false })
class MessageMedia {
  @Prop({
    ref: Media.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  mediaId: mongoose.Types.ObjectId;

  @Prop({ default: true, required: true })
  isFree: boolean;
}

const MessageMediaSchema = SchemaFactory.createForClass(MessageMedia);

@Schema({
  collection: 'message',
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      const _id = ret._id as mongoose.Types.ObjectId;

      ret.id = _id.toString();
      ret.createdAt = _id.getTimestamp().toISOString();

      delete ret._id;

      return ret;
    },
    virtuals: true,
  },
  toObject: { virtuals: true },
  versionKey: false,
  virtuals: true,
})
export class Message extends Document {
  @Factory((faker, ctx) => ctx!.chatId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  chatId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
    ref: User.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker!.word.words({ count: { max: 20, min: 8 } }))
  @Prop({ type: String })
  text: string;

  @Factory((faker, ctx) => ctx!.medias ?? [])
  @Prop({
    default: [],
    type: [MessageMediaSchema],
  })
  medias: MessageMedia[];

  @Prop({
    default: 0,
    type: Number,
  })
  price: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

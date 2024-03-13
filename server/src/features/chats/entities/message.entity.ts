import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Media } from '@/features/media/entities/media.entity';
import { User } from '@/features/users/entities/user.entity';

@Schema({
  collection: 'messages',
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false,
  virtuals: true,
})
export class Message extends Document {
  @Factory((faker) => {
    return mongoose.Types.ObjectId.createFromTime(
      faker!.date.recent({ days: 15 }).getTime() / 1000,
    );
  })
  @Prop({
    default: () => new mongoose.Types.ObjectId(),
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

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
  content: string;

  @Factory((faker, ctx) => ctx!.media ?? [])
  @Prop({
    default: [],
    ref: Media.name,
    type: [mongoose.Schema.Types.ObjectId],
  })
  media: mongoose.Types.ObjectId[];

  @Factory(() => [])
  @Prop({ default: [], type: [String] })
  gifs: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.virtual('user', {
  as: 'user',
  foreignField: '_id',
  justOne: true,
  localField: 'userId',
  ref: User.name,
});

export type MessageFilterQuery = FilterQuery<Message>;

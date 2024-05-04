import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Media } from '@/modules/media/infrastructure/entities/media.entity';
import { User } from '@/modules/users/infrastructure/repositories/mongodb/schemas/user.schema';

@Schema({ _id: false, versionKey: false })
class PostMedia {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  mediaId: mongoose.Types.ObjectId;

  @Prop({ default: true, required: true, type: Boolean })
  isFree: boolean;
}

const PostMediaSchema = SchemaFactory.createForClass(PostMedia);

@Schema({
  collection: 'post',
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.createdAt = ret._id.getTimestamp().toISOString();

      delete ret._id;

      return ret;
    },
    virtuals: true,
  },
  toObject: { virtuals: true },
  virtuals: true,
})
export class Post extends Document {
  @Factory((faker) => {
    return mongoose.Types.ObjectId.createFromTime(
      faker!.date.recent({ days: 90 }).getTime() / 1000,
    );
  })
  @Prop({
    default: () => new mongoose.Types.ObjectId(),
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
    ref: User.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker!.word.words({ count: { max: 20, min: 10 } }))
  @Prop({ type: String })
  content: string;

  @Factory((faker, ctx) => ctx!.medias ?? [])
  @Prop({
    default: [],
    type: [PostMediaSchema],
  })
  medias: PostMedia[];

  @Prop({
    default: 0,
    type: Number,
  })
  commentsCount: number;

  @Prop({
    default: 0,
    type: Number,
  })
  likesCount: number;

  @Prop({
    default: 0,
    type: Number,
  })
  price: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

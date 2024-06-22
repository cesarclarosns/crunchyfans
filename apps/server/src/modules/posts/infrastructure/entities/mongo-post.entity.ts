import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({ _id: false, versionKey: false })
class MongoPostMedia {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  mediaId: mongoose.Types.ObjectId;

  @Prop({ default: true, required: true, type: Boolean })
  isFree: boolean;
}

const MongoPostMediaSchema = SchemaFactory.createForClass(MongoPostMedia);

@Schema({
  collection: 'post',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  versionKey: false,
})
export class MongoPost extends Document {
  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
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
    type: [MongoPostMediaSchema],
  })
  medias: MongoPostMedia[];

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

export const MongoPostSchema = SchemaFactory.createForClass(MongoPost);

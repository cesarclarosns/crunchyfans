import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  collection: 'postComment',
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
    virtuals: true,
  },
  toObject: { virtuals: true },
  versionKey: false,
  virtuals: true,
})
export class PostComment extends Document {
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

  @Factory((faker, ctx) => ctx!.post_id)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  postId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.post_comment_id)
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  postCommentId?: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker!.word.words({ count: { max: 15, min: 10 } }))
  @Prop({
    required: true,
    type: String,
  })
  content: string;

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
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);

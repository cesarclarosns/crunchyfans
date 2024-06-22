import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  collection: 'postComment',
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
export class MongoPostComment extends Document {
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

export const MongoPostCommentSchema =
  SchemaFactory.createForClass(MongoPostComment);

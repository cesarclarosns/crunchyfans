import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  _id: false,
  collection: 'postCommentLikes',
  timestamps: false,
  versionKey: false,
})
export class PostCommentLike extends Document {
  @Factory((faker, ctx) => ctx.userId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.postCommentId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  postCommentId: mongoose.Types.ObjectId;
}

export const PostCommentLikeSchema =
  SchemaFactory.createForClass(PostCommentLike);

PostCommentLikeSchema.index(
  {
    postCommentId: 1,
    userId: 1,
  },
  { unique: true },
);

export type TPostCommentLikeFilterQuery = FilterQuery<PostCommentLike>;

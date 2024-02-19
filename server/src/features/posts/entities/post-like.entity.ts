import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  _id: false,
  collection: 'postLikes',
  timestamps: false,
  versionKey: false,
})
export class PostLike extends Document {
  @Factory((faker, ctx) => ctx.userId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: string;

  @Factory((faker, ctx) => ctx.postId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  postId: string;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.index(
  {
    postId: 1,
    userId: 1,
  },
  { unique: true },
);

export type TPostLikeFilterQuery = FilterQuery<PostLike>;

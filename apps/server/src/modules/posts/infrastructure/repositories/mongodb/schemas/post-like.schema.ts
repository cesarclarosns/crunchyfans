import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  _id: false,
  collection: 'postLike',
  id: false,
  timestamps: false,
  versionKey: false,
})
export class PostLike extends Document {
  @Factory((faker, ctx) => ctx!.postId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  postId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.index(
  {
    postId: 1,
    userId: 1,
  },
  { unique: true },
);

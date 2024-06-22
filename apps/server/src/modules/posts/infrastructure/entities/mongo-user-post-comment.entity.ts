import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  _id: false,
  collection: 'userPostComment',
  id: false,
  timestamps: true,
  versionKey: false,
})
export class MongoUserPostComment extends Document {
  @Factory((faker, ctx) => ctx!.userId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.postCommentId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  postCommentId: mongoose.Types.ObjectId;

  @Prop({ type: Boolean })
  isLiked: boolean;
}

export const MongoUserPostCommentSchema =
  SchemaFactory.createForClass(MongoUserPostComment);

MongoUserPostCommentSchema.index(
  {
    postCommentId: 1,
    userId: 1,
  },
  { unique: true },
);

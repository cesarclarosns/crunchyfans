import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userPosts',
  id: false,
  timestamps: true,
  versionKey: false,
})
export class MongoUserPosts extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0, required: true, type: Number })
  postsCount: number;

  @Prop({ default: 0, required: true, type: Number })
  mediasCount: number;

  @Prop({ default: 0, required: true, type: Number })
  imagesCount: number;

  @Prop({ default: 0, required: true, type: Number })
  videosCount: number;

  @Prop({ default: 0, required: true, type: Number })
  audiosCount: number;

  @Prop({ default: 0, required: true, type: Number })
  likesCount: number;
}

export const MongoUserPostsSchema =
  SchemaFactory.createForClass(MongoUserPosts);

MongoUserPostsSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

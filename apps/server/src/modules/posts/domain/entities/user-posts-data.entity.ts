import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userPostsData',
  id: false,
  versionKey: false,
})
export class UserPostsData extends Document {
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

export const UserPostsDataSchema = SchemaFactory.createForClass(UserPostsData);

UserPostsDataSchema.index(
  {
    userId: 1,
  },
  { unique: true },
);

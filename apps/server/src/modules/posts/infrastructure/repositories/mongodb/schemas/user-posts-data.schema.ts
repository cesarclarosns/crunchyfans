import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'userPostsMetadata',
  versionKey: false,
})
export class UserPostsMetadata extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0, required: true, type: Number })
  postsCount: number;

  @Prop({ default: 0, required: true, type: Number })
  mediasCount: number;
}

export const UserPostsMetadataSchema =
  SchemaFactory.createForClass(UserPostsMetadata);

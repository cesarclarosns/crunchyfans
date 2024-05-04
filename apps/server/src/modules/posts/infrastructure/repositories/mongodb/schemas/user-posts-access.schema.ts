import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'userPostsAccess',
  versionKey: false,
})
export class UserPostsAccess extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  postId: mongoose.Schema.Types.ObjectId;
}

export const UserPostsAccessSchema =
  SchemaFactory.createForClass(UserPostsAccess);

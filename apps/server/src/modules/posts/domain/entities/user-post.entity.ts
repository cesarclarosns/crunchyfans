import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  _id: false,
  collection: 'userPost',
  id: false,
  versionKey: false,
})
export class UserPost extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  postId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Boolean })
  isLiked: boolean;

  @Prop({ type: Boolean })
  isPurchased: boolean;
}

export const UserPostSchema = SchemaFactory.createForClass(UserPost);

UserPostSchema.index({ postId: 1, userId: 1 }, { unique: true });

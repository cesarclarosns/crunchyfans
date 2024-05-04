import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'userFollowersData',
  versionKey: false,
})
export class UserFollowersData {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ default: 0, required: true, type: Number })
  followersCount: number;

  @Prop({ default: 0, required: true, type: Number })
  followeesCount: number;
}

export const UserFollowersDataSchema =
  SchemaFactory.createForClass(UserFollowersData);

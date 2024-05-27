import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'follower',
  versionKey: false,
})
export class Follower {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  followerId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  followeeId: mongoose.Types.ObjectId;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);

FollowerSchema.index({ followeeId: 1, followerId: 1 }, { unique: true });

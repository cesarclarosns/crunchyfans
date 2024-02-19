import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';

import { ObjectValues } from '@/common/types/object-values.type';
import { User } from '@/features/users/entities/user.entity';

import { FOLLOWER_STATUS } from '../followers.constants';

@Schema({
  collection: 'followers',
  timestamps: false,
  toJSON: {
    virtuals: true,
  },
  toObject: { virtuals: true },
  versionKey: false,
  virtuals: true,
})
export class Follower extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  followeeId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  followerId: mongoose.Types.ObjectId;

  @Prop({
    default: FOLLOWER_STATUS.accepted,
    enum: Object.values(FOLLOWER_STATUS),
    type: String,
  })
  status: ObjectValues<typeof FOLLOWER_STATUS>;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);

FollowerSchema.index(
  {
    followeeId: 1,
    followerId: 1,
  },
  { unique: true },
);

FollowerSchema.virtual('followee', {
  as: 'followee',
  foreignField: '_id',
  justOne: true,
  localField: 'followeeId',
  ref: User.name,
});

FollowerSchema.virtual('follower', {
  as: 'follower',
  foreignField: '_id',
  justOne: true,
  localField: 'followerId',
  ref: User.name,
});

export type TFollowerFilterQuery = FilterQuery<Follower>;

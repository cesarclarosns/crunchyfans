import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { UserStatus } from '@/modules/users/domain/types/user-status';

@Schema({
  collection: 'user',
  id: false,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  versionKey: false,
})
export class MongoUser extends Document {
  @Factory((faker, ctx) => faker!.person.fullName({ sex: ctx!.gender }))
  @Prop({ required: true, type: String })
  name: string;

  @Factory((faker, ctx) => faker!.internet.userName({ firstName: ctx!.name }))
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  username: string;

  @Factory((faker, ctx) => faker!.internet.email({ firstName: ctx!.name }))
  @Prop({
    required: true,
    sparse: true,
    type: String,
    unique: true,
  })
  email: string;

  @Factory((faker, ctx) => ctx!.hashedPassword)
  @Prop({ type: String })
  hashedPassword: string;

  @Factory((faker) => faker!.person.bio())
  @Prop({ type: String })
  about: string;

  @Factory((faker) => faker!.date.recent())
  @Prop({ type: Date })
  lastSeen: string;

  @Prop({
    default: 'online' satisfies UserStatus,
    enum: ['offline', 'online'] satisfies UserStatus[],
    type: String,
  })
  status: UserStatus;

  @Prop({ default: false, type: Boolean })
  isEmailVerified: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  profilePicture: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  coverPicture: mongoose.Types.ObjectId;
}

export const MongoUserSchema = SchemaFactory.createForClass(MongoUser);

MongoUserSchema.index({
  email: 1,
  name: 1,
  username: 1,
});

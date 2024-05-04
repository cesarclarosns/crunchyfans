import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Media } from '@/modules/media/infrastructure/entities/media.entity';

import { UserStatus } from '../../../../domain/types/user-status';

@Schema({
  _id: false,
  versionKey: false,
})
class Pictures {
  @Prop({
    ref: Media.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  profile?: string;

  @Prop({
    ref: Media.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  cover?: string;
}

const PicturesSchema = SchemaFactory.createForClass(Pictures);

@Schema({
  _id: false,
  versionKey: false,
})
class OAuth {
  @Prop({
    sparse: true,
    type: String,
    unique: true,
  })
  googleId?: string;
}

const OAuthSchema = SchemaFactory.createForClass(OAuth);

@Schema({
  collection: 'user',
  strict: true,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();

      return ret;
    },
  },
  versionKey: false,
})
export class User extends Document {
  @Factory((faker, ctx) => {
    if (ctx && ctx._id) {
      return ctx._id;
    } else {
      return new mongoose.Types.ObjectId();
    }
  })
  @Prop({
    default: () => new mongoose.Types.ObjectId(),
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

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

  @Prop({ default: {}, type: PicturesSchema })
  pictures: Pictures;

  @Prop({
    default: {},
    type: OAuthSchema,
  })
  oauth: OAuth;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  email: 1,
  name: 1,
  'oauth.googleId': 1,
  username: 1,
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { ObjectValues } from '@/common/types/object-values.type';
import { Media } from '@/features/media/entities/media.entity';

import { USER_STATUS } from '../users.constants';

@Schema({ _id: false, versionKey: false })
class OAuth extends Document {
  @Prop({
    sparse: true,
    type: String,
    unique: true,
  })
  googleId: string;
}

const OAuthSchema = SchemaFactory.createForClass(OAuth);

@Schema({ _id: false, versionKey: false })
class Pictures extends Document {
  @Prop({
    ref: Media.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  profilePicture: mongoose.Types.ObjectId;
}

const PicturesSchema = SchemaFactory.createForClass(Pictures);

@Schema({ _id: false, versionKey: false })
class Settings extends Document {
  @Prop({
    default: USER_STATUS.online,
    enum: Object.values(USER_STATUS),
    type: String,
  })
  status: ObjectValues<typeof USER_STATUS>;
}

const SettingsSchema = SchemaFactory.createForClass(Settings);

@Schema({ _id: false, versionKey: false })
class Metadata extends Document {
  @Prop({ default: 0, required: false, type: Number })
  subscribersCount: number;
}

const MetadataSchema = SchemaFactory.createForClass(Metadata);

@Schema({
  collection: 'users',
  id: false,
  strict: true,
  timestamps: true,
})
export class User extends Document {
  @Factory((faker, ctx) => faker!.person.fullName({ sex: ctx!.gender }))
  @Prop({ required: true, type: String })
  displayName: string;

  @Factory((faker, ctx) =>
    faker!.internet.userName({ firstName: ctx!.displayName }),
  )
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Factory((faker, ctx) =>
    faker!.internet.email({ firstName: ctx!.displayName }),
  )
  @Prop({ sparse: true, type: String, unique: true })
  email: string;

  @Factory((faker, ctx) => ctx!.password)
  @Prop({ type: String })
  password: string;

  @Factory((faker) => faker!.person.bio())
  @Prop({ type: String })
  bio: string;

  @Factory((faker) => faker!.date.recent())
  @Prop({ type: Date })
  lastConnection: string;

  @Factory((faker, ctx) => ctx!.pictures)
  @Prop({ default: {}, required: true, type: PicturesSchema })
  pictures: Pictures;

  @Prop({ type: OAuthSchema })
  oauth: OAuth;

  @Factory(() => ({ status: USER_STATUS.online }))
  @Prop({ default: {}, required: true, type: SettingsSchema })
  settings: Settings;

  @Prop({ default: {}, required: true, type: MetadataSchema })
  metadata: Metadata;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type TUserFilterQuery = FilterQuery<User>;

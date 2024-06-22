import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { MediaType } from '@/modules/media/domain/types/media-type';

@Schema({
  collection: 'media',
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
export class MongoMedia extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    enum: ['audio', 'image', 'video'] satisfies MediaType[],
    required: true,
    type: String,
  })
  type: MediaType;

  @Prop({ default: {}, of: String, type: Map })
  sources: Record<string, string>;

  @Prop({ type: String })
  source: string;

  @Prop({ type: String })
  thumbnail: string;

  @Prop({ type: String })
  preview: string;

  @Prop({
    default: false,
    required: true,
    type: Boolean,
  })
  isReady: boolean;

  @Prop({
    default: false,
    required: true,
    type: Boolean,
  })
  hasError: boolean;

  @Prop({ required: true, type: String })
  fileKey: string;

  @Prop({ required: true, type: Boolean })
  needsWatermark: boolean;

  @Prop({ required: true, type: Boolean })
  needsPreview: boolean;

  @Prop({ required: true, type: Boolean })
  needsThumbnail: boolean;
}

export const MongoMediaSchema = SchemaFactory.createForClass(MongoMedia);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { MediaType } from '@/modules/media/domain/types/media-type';

@Schema({
  _id: false,
  versionKey: false,
})
class Processing {
  @Prop({ required: true, type: String })
  fileKey: string;

  @Prop({ required: true, type: Boolean })
  needsWatermark: boolean;

  @Prop({ required: true, type: Boolean })
  needsPreview: boolean;

  @Prop({ required: true, type: Boolean })
  needsThumbnail: boolean;
}

const ProcessingSchema = SchemaFactory.createForClass(Processing);

@Schema({
  collection: 'media',
  strict: true,
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();

      delete ret._id;

      return ret;
    },
  },
  versionKey: false,
})
export class Media extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: ProcessingSchema })
  processing: Processing;

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
    required: true,
    type: Boolean,
  })
  isReady: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  hasError: boolean;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
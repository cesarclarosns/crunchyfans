import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';

import { ObjectValues } from '@/common/types/object-values.type';

import {
  MEDIA_TYPE,
  PROCESSING_STATUS,
  TRANSCODING_STATUS,
} from '../media.constants';

@Schema({
  _id: false,
  versionKey: false,
})
class Thumbnail {
  @Prop({ required: true, type: String })
  fileKey: string;

  @Prop({ required: true, type: String })
  quality: string;
}

const ThumbnailSchema = SchemaFactory.createForClass(Thumbnail);

@Schema({
  _id: false,
  versionKey: false,
})
class Source {
  @Prop({ required: true, type: String })
  fileKey: string;

  @Prop({ required: true, type: String })
  quality: string;

  @Prop({ type: String })
  duration: string;
}

const SourceSchema = SchemaFactory.createForClass(Source);

@Schema({
  _id: false,
  versionKey: false,
})
class Processing {
  @Prop({
    default: TRANSCODING_STATUS.submit,
    enum: Object.values(PROCESSING_STATUS),
    required: true,
    type: String,
  })
  transcodingStatus: ObjectValues<typeof TRANSCODING_STATUS>;

  @Prop({ type: String })
  fileKey: string;
}

const ProcessingSchema = SchemaFactory.createForClass(Processing);

@Schema({
  collection: 'media',
  strict: true,
  timestamps: false,
  versionKey: false,
})
export class Media extends Document {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ enum: Object.values(MEDIA_TYPE), required: true, type: String })
  mediaType: ObjectValues<typeof MEDIA_TYPE>;

  @Prop({
    default: () => ({}),
    defaultOptions: {
      validate: true,
    },
    required: true,
    type: ProcessingSchema,
  })
  processing: Processing;

  @Prop({
    default: () => [],
    defaultOptions: {
      validate: true,
    },
    required: true,
    type: [SourceSchema],
  })
  sources: Source[];

  @Prop({
    default: () => [],
    defaultOptions: {
      validate: true,
    },
    required: true,
    type: [ThumbnailSchema],
  })
  thumbnails: Thumbnail[];
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({
  mediaType: 1,
  userId: 1,
});

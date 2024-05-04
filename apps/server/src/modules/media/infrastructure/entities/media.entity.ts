import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { MediaType } from '../../domain/types/media-type';
import { TranscodingStatus } from '../../domain/types/transcoding-status';

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
    enum: ['submitted', 'completed', 'failed'] satisfies TranscodingStatus[],
    required: true,
    type: String,
  })
  transcodingStatus: TranscodingStatus;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

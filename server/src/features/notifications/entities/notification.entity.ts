import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  versionKey: false,
})
export class Notification {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  collection: 'notification',
  timestamps: { createdAt: true, updatedAt: false },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      ret.userId = ret.userId.toString();

      delete ret._id;

      return ret;
    },
  },
  versionKey: false,
})
export class Notification {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    default: false,
    type: Boolean,
  })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({
  createdAt: -1,
  userId: 1,
});

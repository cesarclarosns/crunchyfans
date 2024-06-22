import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({ _id: false, versionKey: false })
class MongoMessageMedia {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  mediaId: mongoose.Types.ObjectId;

  @Prop({ default: true, required: true })
  isFree: boolean;
}

const MongoMessageMediaSchema = SchemaFactory.createForClass(MongoMessageMedia);

@Schema({
  collection: 'message',
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = (ret._id as mongoose.Types.ObjectId).toString();
      delete ret._id;
      return ret;
    },
  },
  versionKey: false,
})
export class MongoMessage extends Document {
  @Factory((faker, ctx) => ctx!.chatId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  chatId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx!.userId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker!.word.words({ count: { max: 20, min: 8 } }))
  @Prop({ type: String })
  text: string;

  @Factory((faker, ctx) => ctx!.medias ?? [])
  @Prop({
    default: [],
    type: [MongoMessageMediaSchema],
  })
  medias: MongoMessageMedia[];

  @Prop({
    default: 0,
    type: Number,
  })
  price: number;
}

export const MongoMessageSchema = SchemaFactory.createForClass(MongoMessage);

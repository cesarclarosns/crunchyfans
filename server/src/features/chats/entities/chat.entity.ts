import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { User } from '@/features/users/entities/user.entity';

@Schema({
  collection: 'chats',
  timestamps: false,
  versionKey: false,
})
export class Chat extends Document {
  @Factory((faker, ctx) => ctx!.participants)
  @Prop({
    ref: User.name,
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  participants: mongoose.Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

export type ChatFilterQuery = FilterQuery<Chat>;

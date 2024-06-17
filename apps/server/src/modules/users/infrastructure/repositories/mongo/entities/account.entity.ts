import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { AccountProvider } from '@/modules/users/domain/types/account-provider';

@Schema({
  collection: 'account',
  id: false,
  timestamps: true,
})
export class Account extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({
    enum: ['apple', 'google'] satisfies AccountProvider[],
    required: true,
    type: String,
  })
  provider: AccountProvider;

  @Prop({
    required: true,
    type: String,
  })
  providerAccountId: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.index(
  {
    provider: 1,
    userId: 1,
  },
  { unique: true },
);

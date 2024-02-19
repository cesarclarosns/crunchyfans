import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { Media } from '@/features/media/entities/media.entity';
import { User } from '@/features/users/entities/user.entity';

@Schema({
  _id: false,
  versionKey: false,
})
class PostMetadata extends Document {
  @Prop({
    default: 0,
    type: Number,
  })
  commentsCount: number;

  @Prop({
    default: 0,
    type: Number,
  })
  likesCount: number;
}

export const PostMetadataSchema = SchemaFactory.createForClass(PostMetadata);

@Schema({
  collection: 'posts',
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  virtuals: true,
})
export class Post extends Document {
  @Factory((faker, ctx) => ctx._id)
  @Prop({
    default: () => new mongoose.Types.ObjectId(),
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.userId)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker.word.words({ count: { max: 20, min: 10 } }))
  @Prop({ type: String })
  content: string;

  @Factory((faker, ctx) => ctx.media ?? [])
  @Prop({
    default: [],
    ref: Media.name,
    type: [mongoose.Schema.Types.ObjectId],
  })
  media: mongoose.Types.ObjectId[];

  @Prop({
    default: () => ({}),
    defaultOptions: {
      validate: true,
    },
    required: true,
    type: PostMetadataSchema,
  })
  metadata: PostMetadata;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('user', {
  as: 'user',
  foreignField: '_id',
  justOne: true,
  localField: 'userId',
  ref: User.name,
});

export type TPostFilterQuery = FilterQuery<Post>;

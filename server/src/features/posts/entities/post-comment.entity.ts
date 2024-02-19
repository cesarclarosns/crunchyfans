import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, FilterQuery } from 'mongoose';
import { Factory } from 'nestjs-seeder';

import { User } from '@/features/users/entities/user.entity';

@Schema({ _id: false, versionKey: false })
class PostCommentMetadata extends Document {
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

const PostCommentMetadataSchema =
  SchemaFactory.createForClass(PostCommentMetadata);

@Schema({
  collection: 'postComments',
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false,
  virtuals: true,
})
export class PostComment extends Document {
  @Factory((faker, ctx) => ctx._id)
  @Prop({
    default: () => new mongoose.Types.ObjectId(),
    type: mongoose.Schema.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.postId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  postId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.postCommentId)
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId })
  postCommentId: mongoose.Types.ObjectId;

  @Factory((faker, ctx) => ctx.userId)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Factory((faker) => faker.word.words({ count: { max: 15, min: 10 } }))
  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Factory((faker, ctx) => ctx.gifs ?? [])
  @Prop({ default: [], type: [String] })
  gifs: string[];

  @Prop({
    default: () => ({}),
    defaultOptions: {
      validate: true,
    },
    required: true,
    type: PostCommentMetadataSchema,
  })
  metadata: PostCommentMetadata;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);

PostCommentSchema.virtual('user', {
  as: 'user',
  foreignField: '_id',
  justOne: true,
  localField: 'userId',
  ref: User.name,
});

export type TPostCommentFilterQuery = FilterQuery<PostComment>;

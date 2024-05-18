import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Media } from '../../media/domain/entities/media.entity';
import { User } from '../../users/infrastructure/repositories/entities/user.entity';
import { Post } from '../domain/entities/post.entity';
import { PostComment } from '../domain/entities/post-comment.entity';

@Injectable()
export class PostsSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async seed() {
    const users = await this.userModel.find();

    // // Create posts
    // await Promise.all(
    //   users.map(async (user) => {
    //     const postsRecords = DataFactory.createForClass(Post).generate(10, {
    //       userId: user._id,
    //     });

    //     await this.postModel.insertMany(postsRecords);
    //   }),
    // );

    // // Create post comments
    // await Promise.all(
    //   users.map(async (user) => {
    //     const posts = await this.postModel.aggregate([
    //       { $sample: { size: 10 } },
    //     ]);

    //     await Promise.all(
    //       posts.map(async (post) => {
    //         // Create post comments and update metadata (commentsCount)
    //         const postCommentRecords = DataFactory.createForClass(
    //           PostComment,
    //         ).generate(5, {
    //           postId: post._id,
    //           userId: user._id,
    //         });

    //         const postComments =
    //           await this.postCommentModel.insertMany(postCommentRecords);

    //         await this.postModel.updateOne(
    //           {
    //             _id: post._id,
    //           },
    //           {
    //             $inc: {
    //               'metadata.commentsCount': 5,
    //             },
    //           },
    //         );

    //         // Create replies to comments and update metadata (commentsCount)
    //         await Promise.all([
    //           postComments.map(async (postComment) => {
    //             const postCommentRecords = DataFactory.createForClass(
    //               PostComment,
    //             ).generate(3, {
    //               postCommentId: postComment._id,
    //               postId: postComment.postId,
    //               userId: user._id,
    //             });

    //             await this.postCommentModel.insertMany(postCommentRecords);

    //             await this.postCommentModel.updateOne(
    //               {
    //                 _id: postComment._id,
    //               },
    //               {
    //                 $inc: {
    //                   'metadata.commentsCount': 3,
    //                 },
    //               },
    //             );
    //           }),
    //         ]);
    //       }),
    //     );
    //   }),
    // );

    // // Create post likes and post comment likes
    // await Promise.all(
    //   users.map(async (user) => {
    //     // Create post likes and update post metadata (likesCount)
    //     const posts = await this.postModel.aggregate([
    //       { $sample: { size: 20 } },
    //     ]);

    //     const postLikeRecords = posts.map((post) => ({
    //       postId: post._id,
    //       userId: user._id,
    //     }));

    //     await this.postLikeModel.insertMany(postLikeRecords);

    //     await this.postModel.updateMany(
    //       {
    //         _id: {
    //           $in: posts.map((post) => post._id),
    //         },
    //       },
    //       {
    //         $inc: {
    //           'metadata.likesCount': 1,
    //         },
    //       },
    //     );

    //     // Create post comment likes and update post comment metadata (likesCount)
    //     const postComments = await this.postCommentModel.aggregate([
    //       { $sample: { size: 20 } },
    //     ]);

    //     const postCommentLikeRecords = postComments.map((postComment) => ({
    //       postCommentId: postComment._id,
    //       userId: user._id,
    //     }));

    //     await this.postCommentLikeModel.insertMany(postCommentLikeRecords);

    //     await this.postCommentModel.updateMany(
    //       {
    //         _id: {
    //           $in: postComments.map((postComment) => postComment._id),
    //         },
    //       },
    //       {
    //         $inc: {
    //           'metadata.likesCount': 1,
    //         },
    //       },
    //     );
    //   }),
    // );
  }

  async drop() {
    await Promise.all([]);
  }
}

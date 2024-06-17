export class UserPosts {
  userId: string;
  postsCount: number;
  likesCount: number;
  mediasCount: number;
  imagesCount: number;
  videosCount: number;
  audiosCount: number;

  constructor(model: UserPosts) {
    Object.assign(this, model);
  }
}

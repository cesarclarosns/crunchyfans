export class UserPostsData {
  userId: string;
  postsCount: number;
  likesCount: number;
  mediasCount: number;
  imagesCount: number;
  videosCount: number;
  audiosCount: number;

  constructor(model: UserPostsData) {
    Object.assign(this, model);
  }
}

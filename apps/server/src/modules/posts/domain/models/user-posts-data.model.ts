export class UserPostsData {
  userId: string;
  postsCount: number;
  mediasCount: number;
  imagesCount: number;
  videosCount: number;
  audiosCount: number;
  likesCount: number;

  constructor(model: UserPostsData) {
    Object.assign(this, model);
  }
}

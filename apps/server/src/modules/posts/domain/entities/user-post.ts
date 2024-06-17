export class UserPost {
  userId: string;
  postId: string;
  isPurchased: boolean;
  isLiked: boolean;

  constructor(model: UserPost) {
    Object.assign(this, model);
  }
}

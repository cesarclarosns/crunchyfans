export class UserPostComment {
  userId: string;
  postCommentId: string;
  isLiked: boolean;

  constructor(model: UserPostComment) {
    Object.assign(this, model);
  }
}

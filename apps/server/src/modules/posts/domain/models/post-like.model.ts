export class PostLike {
  postId: string;
  userId: string;

  constructor(model: PostLike) {
    Object.assign(this, model);
  }
}

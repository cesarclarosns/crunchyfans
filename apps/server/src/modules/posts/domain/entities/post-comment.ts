export class PostComment {
  id: string;
  userId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;

  constructor(model: PostComment) {
    Object.assign(this, model);
  }
}

export class PostCommentWithViewerData extends PostComment {
  isLiked: boolean;
}

export class PostComment {
  id: string;
  userId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export class PostCommentWithViewerData extends PostComment {
  isLiked: boolean;
}

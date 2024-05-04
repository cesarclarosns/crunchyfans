export class PostCommentDto {
  id: string;

  userId: string;

  createdAt: string;

  content: string;

  commentsCount: number;

  likesCount: number;

  constructor(partial: Partial<PostCommentDto>) {
    Object.assign(this, partial);
  }
}

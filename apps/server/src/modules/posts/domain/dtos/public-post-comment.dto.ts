import { PostCommentDto } from './post-comment.dto';

export class PublicPostComment extends PostCommentDto {
  isLiked: boolean;

  constructor(partial: Partial<PublicPostComment>) {
    super(partial);

    Object.assign(this, partial);
  }
}

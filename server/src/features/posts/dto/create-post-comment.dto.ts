import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreatePostCommentDto {
  @IsOptional()
  @IsObjectId()
  postId: string;

  @IsOptional()
  @IsObjectId()
  postCommentId: string;

  @IsOptional()
  @IsObjectId()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

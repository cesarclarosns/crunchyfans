import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';

export class CreatePostCommentDto {
  @IsOptional()
  @IsObjectIdString()
  postId: string;

  @IsOptional()
  @IsObjectIdString()
  postCommentId: string;

  @IsOptional()
  @IsObjectIdString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}

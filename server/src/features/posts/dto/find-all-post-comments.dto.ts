import { IsIn, IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllPostCommentsDto extends PaginationQueryDto {
  @IsOptional()
  @IsObjectId()
  postId: string;

  @IsOptional()
  @IsObjectId()
  postCommentId?: string;

  @IsOptional()
  @IsObjectId()
  userId?: string;
}

import { IsOptional } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';
import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class FindAllPostCommentsDto extends PaginationQueryDto {
  @IsObjectIdString()
  postId: string;

  @IsOptional()
  @IsObjectIdString()
  postCommentId: string;

  @IsOptional()
  @IsObjectIdString()
  toUserId: string;
}

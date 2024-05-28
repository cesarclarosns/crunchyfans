import { IsOptional } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';
import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class GetPostsDto extends PaginationQueryDto {
  @IsOptional()
  @IsObjectIdString()
  cursor: string;
}

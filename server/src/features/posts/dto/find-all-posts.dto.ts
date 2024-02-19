import { IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllPostsDto extends PaginationQueryDto {
  @IsObjectId()
  @IsOptional()
  cursor: string;

  @IsObjectId()
  user: string;

  @IsObjectId()
  @IsOptional()
  userId?: string;
}

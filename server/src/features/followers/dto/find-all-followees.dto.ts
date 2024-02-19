import { IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllFolloweesDto extends PaginationQueryDto {
  @IsObjectId()
  @IsOptional()
  target: string;
}

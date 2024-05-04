import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';
import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class FindAllChatsDto extends PaginationQueryDto {
  @IsObjectIdString()
  @IsOptional()
  toUserId: string;

  @IsIn(['old', 'recent'])
  order: 'old' | 'recent';

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

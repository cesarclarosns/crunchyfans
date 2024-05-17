import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class GetChatsDto extends PaginationQueryDto {
  @IsIn(['old', 'recent'])
  order: 'old' | 'recent';

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

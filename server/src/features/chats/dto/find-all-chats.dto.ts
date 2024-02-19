import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllChatsDto extends PaginationQueryDto {
  @IsObjectId()
  @IsOptional()
  userId: string;

  @IsIn(['old', 'recent'])
  order: 'old' | 'recent';

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

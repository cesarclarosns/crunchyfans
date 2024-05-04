import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';
import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class FindAllMessagesDto extends PaginationQueryDto {
  @IsObjectIdString()
  @IsOptional()
  chatId: string;

  @IsObjectIdString()
  @IsOptional()
  cursor: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

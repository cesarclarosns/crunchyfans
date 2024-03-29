import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllMessagesDto extends PaginationQueryDto {
  @IsObjectId()
  @IsOptional()
  chatId: string;

  @IsObjectId()
  @IsOptional()
  cursor: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class GetMessagesDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  chatId: string;

  @IsString()
  @IsOptional()
  cursor: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query?: string;
}

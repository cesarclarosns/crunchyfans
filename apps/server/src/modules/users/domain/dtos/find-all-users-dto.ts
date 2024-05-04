import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/common/domain/dtos/pagination-query.dto';

export class FindAllUsersDto extends PaginationQueryDto {
  toUserId: string;

  @IsString()
  @IsOptional()
  query: string;
}

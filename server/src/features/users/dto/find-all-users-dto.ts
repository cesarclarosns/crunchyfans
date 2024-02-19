import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllUsersDto extends PaginationQueryDto {
  @IsObjectId()
  @IsOptional()
  cursor: string;

  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  state: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city: string;
}

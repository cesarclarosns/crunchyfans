import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsObjectId()
  userId: string;
}

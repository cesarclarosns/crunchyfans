import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateMediaParamsDto {
  @IsObjectId()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  watermarkText: string;
}

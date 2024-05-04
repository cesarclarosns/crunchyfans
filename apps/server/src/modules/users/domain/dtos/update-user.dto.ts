import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { CreateUserDto, OAuthDto, PicturesDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Type(() => PartialType(PicturesDto))
  @ValidateNested()
  @IsOptional()
  pictures?: PicturesDto;

  @Type(() => PartialType(OAuthDto))
  @ValidateNested()
  @IsOptional()
  oauth?: OAuthDto;
}

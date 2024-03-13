import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { ObjectValues } from '@/common/types/object-values.type';

import { USER_STATUS } from '../users.constants';

class OAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  googleId?: string;
}

class PicturesDto {
  @IsObjectId()
  @IsOptional()
  profilePicture: string;
}

class SettingsDto {
  @IsEnum(USER_STATUS)
  @IsOptional()
  status: ObjectValues<typeof USER_STATUS>;
}

export class CreateUserDto {
  @IsObjectId()
  @IsOptional()
  _id?: string;

  @IsString()
  @MinLength(5)
  username: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bio?: string;

  @Type(() => OAuthDto)
  @ValidateNested()
  @IsOptional()
  oauth?: OAuthDto;

  @Type(() => SettingsDto)
  @ValidateNested()
  @IsOptional()
  settings?: SettingsDto;
}

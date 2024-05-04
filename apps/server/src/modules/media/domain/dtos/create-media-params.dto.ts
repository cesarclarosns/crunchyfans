import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OptionsDto {
  @IsBoolean()
  needsPreview: boolean;

  @IsBoolean()
  needsThumbnail: boolean;

  @IsBoolean()
  needsWatermark: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  watermarkText: string;

  constructor(partial: Partial<OptionsDto>) {
    Object.assign(this, partial);
  }
}

export class CreateMediaParamsDto {
  userId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsObject()
  @Type(() => OptionsDto)
  @ValidateNested()
  options: OptionsDto;

  constructor({ options, ...partial }: Partial<CreateMediaParamsDto>) {
    Object.assign(this, partial);

    if (options) {
      this.options = new OptionsDto(options);
    }
  }
}

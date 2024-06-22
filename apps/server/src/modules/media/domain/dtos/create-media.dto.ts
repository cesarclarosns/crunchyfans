import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsRecord } from '@/common/application/decorators/is-record.decorator';

import { MediaType } from '../types/media-type';

export class CreateMediaDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsIn(['audio', 'image', 'video'] satisfies MediaType[])
  type: MediaType;

  @IsOptional()
  @IsRecord()
  sources: Record<string, string>;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  preview: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsBoolean()
  isReady: boolean;

  @IsOptional()
  @IsBoolean()
  hasError: boolean;

  @IsString()
  fileKey: string;

  @IsBoolean()
  needsThumbnail: boolean;

  @IsBoolean()
  needsWatermark: boolean;

  @IsBoolean()
  needsPreview: boolean;

  constructor(dto: CreateMediaDto) {
    Object.assign(this, dto);
  }
}

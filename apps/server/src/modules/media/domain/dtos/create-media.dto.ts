import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsString, ValidateNested } from 'class-validator';

import { IsRecord } from '@/common/application/decorators/is-record.decorator';

import { MediaType } from '../types/media-type';

class ProcessingDto {
  @IsString()
  fileKey: string;

  @IsBoolean()
  needsThumbnail: boolean;

  @IsBoolean()
  needsWatermark: boolean;

  @IsBoolean()
  needsPreview: boolean;

  constructor(partial: Partial<ProcessingDto>) {
    Object.assign(this, partial);
  }
}

export class CreateMediaDto {
  @IsString()
  userId: string;

  @IsIn(['audio', 'image', 'video'] satisfies MediaType[])
  type: MediaType;

  @IsRecord()
  sources: Record<string, string>;

  @IsString()
  source: string;

  @IsString()
  preview: string;

  @IsString()
  thumbnail: string;

  @Type(() => ProcessingDto)
  @ValidateNested()
  processing: ProcessingDto;

  @IsBoolean()
  isReady: boolean;

  @IsBoolean()
  hasError: boolean;

  constructor({ processing, ...partial }: Partial<CreateMediaDto>) {
    Object.assign(this, partial);

    if (processing) {
      this.processing = new ProcessingDto(processing);
    }
  }
}

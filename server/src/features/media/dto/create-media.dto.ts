import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { ObjectValues } from '@/common/types/object-values.type';

import { MEDIA_TYPE, TRANSCODING_STATUS } from '../media.constants';

export class ThumbnailDto {
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

export class SourceDto {
  @IsString()
  @IsNotEmpty()
  quality: string;

  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

export class ProcessingDto {
  @IsEnum(TRANSCODING_STATUS)
  transcodingStatus: ObjectValues<typeof TRANSCODING_STATUS>;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fileKey: string;
}

export class CreateMediaDto {
  @IsObjectId()
  @IsOptional()
  _id: string;

  @IsObjectId()
  @IsOptional()
  userId: string;

  @IsEnum(MEDIA_TYPE)
  mediaType: ObjectValues<typeof MEDIA_TYPE>;

  @IsObject()
  @ValidateNested()
  @Type(() => ProcessingDto)
  processing: ProcessingDto;

  @IsArray()
  @ValidateNested()
  @Type(() => SourceDto)
  sources: SourceDto[];

  @IsArray()
  @ValidateNested()
  @Type(() => ThumbnailDto)
  thumbnails: ThumbnailDto[];
}

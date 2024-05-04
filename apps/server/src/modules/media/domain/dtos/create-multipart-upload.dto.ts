import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Part {
  @IsString()
  @IsNotEmpty()
  etag: string;

  @IsNumber()
  partNumber: number;
}

export class CreateMultipartUploadDto {
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsOptional()
  @IsNumberString()
  partNumber: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  uploadId?: string;

  @IsOptional()
  @IsBoolean()
  uploads: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Part)
  parts?: Part[];
}

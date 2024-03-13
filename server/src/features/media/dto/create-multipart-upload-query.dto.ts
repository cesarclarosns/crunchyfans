import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMultipartUploadQueryDto {
  @Transform(({ value }) => decodeURIComponent(value))
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

  @IsString()
  @IsOptional()
  uploads?: string;
}

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

  @IsNumberString()
  @IsOptional()
  partNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  uploadId?: string;

  @IsString()
  @IsOptional()
  uploads?: string;
}

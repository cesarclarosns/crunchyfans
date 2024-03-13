import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
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
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Part)
  parts?: Part[];
}

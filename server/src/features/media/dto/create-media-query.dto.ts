import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaQueryDto {
  @Transform(({ value }) => decodeURIComponent(value))
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

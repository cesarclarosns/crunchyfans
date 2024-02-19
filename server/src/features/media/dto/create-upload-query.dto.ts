import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadQueryDto {
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

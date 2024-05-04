import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMultipartUploadDto {
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

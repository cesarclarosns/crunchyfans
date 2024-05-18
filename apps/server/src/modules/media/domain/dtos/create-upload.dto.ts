import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadDto {
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  constructor(partial: Partial<CreateUploadDto>) {
    Object.assign(this, partial);
  }
}

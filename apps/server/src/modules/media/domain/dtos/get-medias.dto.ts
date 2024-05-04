import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class GetMediasDto {
  @Transform((value) => value)
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}

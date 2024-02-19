import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class FindAllMediaDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PostMediaDto {
  @IsString()
  @IsNotEmpty()
  mediaId: string;

  @IsBoolean()
  isFree: boolean;
}

export class CreatePostDto {
  userId: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsArray()
  @ValidateNested()
  @Type(() => PostMediaDto)
  medias: PostMediaDto[];
}

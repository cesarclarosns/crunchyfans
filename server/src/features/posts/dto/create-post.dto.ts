import { IsArray, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreatePostDto {
  @IsObjectId()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsArray()
  @IsObjectId({ each: true })
  media: string[];
}

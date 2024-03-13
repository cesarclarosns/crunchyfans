import { IsArray, IsOptional, IsString } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateMessageDto {
  @IsObjectId()
  @IsOptional()
  chatId: string;

  @IsObjectId()
  @IsOptional()
  userId: string;

  @IsString()
  content: string;

  @IsArray()
  @IsObjectId({ each: true })
  @IsOptional()
  media: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gifs: string[];
}

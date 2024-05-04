import { IsArray, IsOptional, IsString } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';

export class CreateMessageDto {
  @IsObjectIdString()
  @IsOptional()
  chatId: string;

  @IsObjectIdString()
  @IsOptional()
  userId: string;

  @IsString()
  content: string;

  @IsArray()
  @IsObjectIdString({ each: true })
  @IsOptional()
  media: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gifs: string[];
}

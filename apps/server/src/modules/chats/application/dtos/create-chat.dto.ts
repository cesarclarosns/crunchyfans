import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';

export class CreateChatDto {
  @Transform(({ value }) => {
    return Array.from(new Set(value));
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsObjectIdString({ each: true })
  participants: string[];
}

import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateChatDto {
  @Transform(({ value }) => {
    return Array.from(new Set(value));
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsObjectId({ each: true })
  participants: string[];
}

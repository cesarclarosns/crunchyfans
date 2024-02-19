import { IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateChatMassiveMessageDto {
  @IsObjectId()
  @IsOptional()
  userId: string;
}

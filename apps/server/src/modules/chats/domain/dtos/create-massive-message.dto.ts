import { IsOptional } from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';

export class CreateMassiveMessageDto {
  @IsOptional()
  @IsObjectIdString()
  userId: string;
}

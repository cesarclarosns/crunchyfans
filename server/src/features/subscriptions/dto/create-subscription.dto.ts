import { IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsObjectId()
  userId: string;

  @IsObjectId()
  targetUserId: string;
}

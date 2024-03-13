import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreateSubscriptionDto {
  @IsObjectId()
  targetUserId: string;

  @IsOptional()
  @IsObjectId()
  userId: string;

  @IsOptional()
  @ValidateIf((obj) => !!obj.priceUnitAmount)
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsOptional()
  @IsNumber()
  @Min(499)
  @Max(4999)
  priceUnitAmount: number;
}

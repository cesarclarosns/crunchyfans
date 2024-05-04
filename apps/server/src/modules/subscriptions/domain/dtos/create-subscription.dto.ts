import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import { IsObjectIdString } from '@/common/application/decorators/is-object-id-string.decorator';

export class CreateSubscriptionDto {
  @IsObjectIdString()
  @IsOptional()
  fromUserId: string;

  @IsObjectIdString()
  toUserId: string;

  @IsNumber()
  @Min(499)
  @Max(4999)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((obj) => !!obj.price)
  @IsOptional()
  paymentMethodId?: string;
}

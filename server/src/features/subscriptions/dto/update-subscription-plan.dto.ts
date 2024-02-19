import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { CreateSubscriptionPlanDto } from './create-subscription-plan.dto';

class BundleDto {
  discount: number;
  duration: number;
}

export class UpdateSubscriptionPlanDto extends PartialType(
  CreateSubscriptionPlanDto,
) {
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => BundleDto)
  bundles: BundleDto[];
}

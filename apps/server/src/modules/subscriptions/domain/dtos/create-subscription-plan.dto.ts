import { IsNumber } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsNumber()
  price: number;
}

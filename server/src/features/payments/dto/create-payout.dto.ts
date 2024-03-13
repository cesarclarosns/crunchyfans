import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';

export class CreatePayoutDto {
  @ApiProperty({
    description: 'A positive integer in cents representing how much to payout.',
  })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsObjectId()
  userId: string;
}

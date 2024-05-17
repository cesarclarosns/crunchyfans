import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePayoutDto {
  @ApiProperty({
    description: 'A positive integer in cents representing how much to payout.',
  })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  userId: string;
}

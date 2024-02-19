import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseBodyDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;
}

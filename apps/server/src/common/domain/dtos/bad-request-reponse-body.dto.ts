import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseBodyDto {
  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  statusCode: number;
}

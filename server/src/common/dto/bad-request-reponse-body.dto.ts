import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseBodyDto {
  @ApiProperty()
  errors: { [key: string]: string };

  @ApiProperty()
  message: string | string[];

  @ApiProperty()
  statusCode: number;
}

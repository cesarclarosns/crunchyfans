import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseBodyDto {
  @ApiProperty()
  accessToken: string;
}

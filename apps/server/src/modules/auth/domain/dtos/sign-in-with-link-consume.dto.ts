import { IsNotEmpty, IsString } from 'class-validator';

export class SignInWithLinkConsumeDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

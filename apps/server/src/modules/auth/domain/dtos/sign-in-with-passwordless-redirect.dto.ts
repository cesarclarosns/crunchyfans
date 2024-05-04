import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInWithPasswordlessRedirectDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

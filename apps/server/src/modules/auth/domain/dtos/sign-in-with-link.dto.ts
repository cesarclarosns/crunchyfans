import { IsEmail } from 'class-validator';

export class SignInWithLinkDto {
  @IsEmail()
  email: string;
  ip: string;
  userAgent: string;
}

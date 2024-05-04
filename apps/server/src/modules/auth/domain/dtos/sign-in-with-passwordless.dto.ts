import { IsEmail } from 'class-validator';

export class SignInWithPasswordlessDto {
  @IsEmail()
  email: string;

  constructor(partial: Partial<SignInWithPasswordlessDto>) {
    Object.assign(this, partial);
  }
}

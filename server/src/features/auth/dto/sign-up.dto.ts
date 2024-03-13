import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { CreateUserDto } from '@/features/users/dto/create-user.dto';

export class SignUpDto {
  @IsString()
  @MinLength(5)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}

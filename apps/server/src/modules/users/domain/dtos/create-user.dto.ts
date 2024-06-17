import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  hashedPassword?: string;

  @IsString()
  @IsNotEmpty()
  profilePicture?: string;

  constructor(dto: CreateUserDto) {
    Object.assign(this, dto);
  }
}

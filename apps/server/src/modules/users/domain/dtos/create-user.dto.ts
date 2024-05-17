import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PicturesDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cover?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  picture?: string;

  constructor(partial: Partial<PicturesDto>) {
    Object.assign(this, partial);
  }
}

export class OAuthDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  googleId?: string;

  constructor(partial: Partial<OAuthDto>) {
    Object.assign(this, partial);
  }
}

export class CreateUserDto {
  id?: string;

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

  about?: string;

  @IsString()
  lastSeen?: string;

  pictures?: PicturesDto;

  oauth?: OAuthDto;

  constructor({ oauth, pictures, ...partial }: Partial<CreateUserDto>) {
    Object.assign(this, partial);

    if (pictures) {
      this.pictures = new PicturesDto(pictures);
    }
    if (oauth) {
      this.oauth = new OAuthDto(oauth);
    }
  }
}

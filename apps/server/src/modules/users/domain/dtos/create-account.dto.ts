import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AccountProvider } from '../types/account-provider';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['apple', 'google'] satisfies AccountProvider[])
  provider: AccountProvider;

  @IsString()
  @IsNotEmpty()
  providerAccountId: string;

  constructor(dto: CreateAccountDto) {
    Object.assign(this, dto);
  }
}

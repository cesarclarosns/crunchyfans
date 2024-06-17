import { AccountProvider } from '../types/account-provider';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithAccountDto extends CreateUserDto {
  provider: AccountProvider;
  providerAccountId: string;

  constructor(dto: CreateUserWithAccountDto) {
    super(dto);

    Object.assign(this, dto);
  }
}

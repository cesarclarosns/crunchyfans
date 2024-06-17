import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work.factory';
import { CreateAccountDto } from '@/modules/users/domain/dtos/create-account.dto';
import { Account } from '@/modules/users/domain/entities';
import { AccountProvider } from '@/modules/users/domain/types/account-provider';

export interface IAccountsRepository {
  createAccount(create: CreateAccountDto, uow: IUnitOfWork): Promise<Account>;

  getAccountByProviderAccountId(
    provider: AccountProvider,
    providerAccountId: string,
  ): Promise<Account | null>;
}

export const IAccountsRepository = Symbol('IAccountsRepository');

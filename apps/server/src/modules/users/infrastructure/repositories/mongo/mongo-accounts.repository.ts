import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work.factory';
import { CreateAccountDto } from '@/modules/users/domain/dtos/create-account.dto';
import { Account } from '@/modules/users/domain/entities';
import { IAccountsRepository } from '@/modules/users/domain/repositories/accounts.repository';
import { AccountProvider } from '@/modules/users/domain/types/account-provider';
import { Account as AccountEntity } from '@/modules/users/infrastructure/repositories/mongo/entities';

export class MongoAccountsRepository implements IAccountsRepository {
  constructor(
    @InjectPinoLogger(MongoAccountsRepository.name)
    private readonly _logger: PinoLogger,
    @InjectModel(AccountEntity.name)
    private readonly _accountEntity: Model<AccountEntity>,
  ) {}

  async createAccount(
    create: CreateAccountDto,
    uow: MongoUnitOfWork,
  ): Promise<Account> {
    const [_account] = await this._accountEntity.insertMany([create], {
      session: uow.session,
    });

    const account = new Account(_account.toJSON());
    return account;
  }

  async getAccountByProviderAccountId(
    provider: AccountProvider,
    providerAccountId: string,
  ): Promise<Account | null> {
    const _account = await this._accountEntity.findOne({
      provider,
      providerAccountId,
    });

    if (!_account) return null;

    const account = new Account(_account.toJSON());
    return account;
  }
}

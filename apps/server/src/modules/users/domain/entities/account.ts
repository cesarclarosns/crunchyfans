export class Account {
  userId: string;
  provider: string;
  providerAccountId: string;

  constructor(entity: Account) {
    Object.assign(this, entity);
  }
}

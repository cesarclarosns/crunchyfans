export interface IUnitOfWork {
  _dbContext: unknown;

  start: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  end: () => Promise<void>;
}

export interface IUnitOfWorkFactory {
  create: () => IUnitOfWork;
}

export const IUnitOfWorkFactory = Symbol('IUnitOfWorkFactory');

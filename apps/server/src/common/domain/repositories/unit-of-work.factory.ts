export interface IUnitOfWork {
  start(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}

export interface IUnitOfWorkFactory {
  create(): IUnitOfWork;
}

export const IUnitOfWorkFactory = Symbol('IUnitOfWorkFactory');

export interface IUnitOfWork<TDBContext> {
  start: () => Promise<TDBContext>;

  commit: (dbContext: TDBContext) => Promise<void>;

  rollback: (dbContext: TDBContext) => Promise<void>;

  end: (dbContext: TDBContext) => Promise<void>;
}

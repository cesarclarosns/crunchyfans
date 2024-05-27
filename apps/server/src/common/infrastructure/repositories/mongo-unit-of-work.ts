import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { IUnitOfWork } from '@/common/domain/repositories/unit-of-work';

export type MongoDBContext = {
  session: mongoose.mongo.ClientSession;
};

@Injectable()
export class MongoUnitOfWork implements IUnitOfWork<MongoDBContext> {
  constructor(
    @InjectConnection() private readonly _connection: mongoose.Connection,
  ) {}

  async start() {
    const session = await this._connection.startSession();
    return { session };
  }

  async commit(dbContext: MongoDBContext): Promise<void> {
    await dbContext.session.commitTransaction();
  }

  async rollback(dbContext: MongoDBContext): Promise<void> {
    await dbContext.session.abortTransaction();
  }

  async end(dbContext: MongoDBContext): Promise<void> {
    await dbContext.session.endSession();
  }
}

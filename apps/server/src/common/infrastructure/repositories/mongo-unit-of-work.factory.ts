import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {
  IUnitOfWork,
  IUnitOfWorkFactory,
} from '@/common/domain/repositories/unit-of-work.factory';

export class MongoUnitOfWork implements IUnitOfWork {
  _connection: mongoose.Connection;
  _dbContext: { session: mongoose.mongo.ClientSession };

  constructor(_connection: mongoose.Connection) {
    this._connection = _connection;
  }

  async start() {
    const session = await this._connection.startSession();
    session.startTransaction();

    this._dbContext = { session };
  }

  async commit() {
    await this._dbContext.session.commitTransaction();
  }

  async rollback() {
    await this._dbContext.session.abortTransaction();
  }

  async end() {
    await this._dbContext.session.endSession();
  }
}

@Injectable()
export class MongoUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(
    @InjectConnection() private readonly _connection: mongoose.Connection,
  ) {}

  create() {
    return new MongoUnitOfWork(this._connection);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {
  IUnitOfWork,
  IUnitOfWorkFactory,
} from '@/common/domain/repositories/unit-of-work.factory';

export class MongoUnitOfWork implements IUnitOfWork {
  session: mongoose.mongo.ClientSession;

  constructor(private readonly _connection: mongoose.Connection) {
    this._connection = _connection;
  }

  async start() {
    const session = await this._connection.startSession();
    session.startTransaction();

    this.session = session;
  }

  async commit() {
    await this.session.commitTransaction();
    await this.session.endSession();
  }

  async rollback() {
    await this.session.abortTransaction();
    await this.session.endSession();
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

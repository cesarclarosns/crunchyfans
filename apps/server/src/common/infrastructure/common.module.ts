import { Module } from '@nestjs/common';

import { MongoUnitOfWork } from '@/common/infrastructure/repositories/mongo-unit-of-work';

@Module({
  exports: [MongoUnitOfWork],
  providers: [MongoUnitOfWork],
})
export class CommonModule {}

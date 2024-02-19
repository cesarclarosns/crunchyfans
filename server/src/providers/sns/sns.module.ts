import { Module } from '@nestjs/common';

import { SnsService } from './sns.service';

@Module({
  exports: [SnsService],
  providers: [SnsService],
})
export class SnsModule {}

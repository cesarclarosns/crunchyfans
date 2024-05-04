import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { settings } from '@/config/settings';

@Module({
  exports: [],
  imports: [MongooseModule.forRoot(settings.DATABASES.MONGODB_URI)],
  providers: [],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';

import { ReviewsController } from './presentation/controllers/reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

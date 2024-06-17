import { Module } from '@nestjs/common';

import { ReviewsService } from '@/modules/reviews/application/services/reviews.service';
import { ReviewsController } from '@/modules/reviews/presentation/controllers/reviews.controller';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

export interface IReviewsService {
  createReview: () => Promise<void>;
  getReviews: () => Promise<void>;
  getReviewById: (reviewId: string) => Promise<void>;
  updateReview: () => Promise<void>;
  deleteReview: () => Promise<void>;
  createOrUpdateRating: (userId: string, viewerId: string) => Promise<string>;
}

export const IReviewsService = Symbol('IReviewsService');

export class UserRatings {
  userId: string;
  ratingsCountByRating: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  constructor(model: UserRatings) {
    Object.assign(this, model);
  }
}

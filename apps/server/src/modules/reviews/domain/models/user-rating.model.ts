export class UserRating {
  userId: string;
  ratingsSum: number;
  ratingsCount: number;

  constructor(model: UserRating) {
    Object.assign(this, model);
  }
}

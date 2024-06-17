export class Rating {
  rating: number;
  rewieweeId: string;
  reviewerId: string;

  constructor(model: Rating) {
    Object.assign(this, model);
  }
}

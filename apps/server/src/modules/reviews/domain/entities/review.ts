export class Review {
  reviewerId: string;
  revieweeId: string;
  text: string;
  createdAt: string;
  updatedAt: string;

  constructor(model: Review) {
    Object.assign(this, model);
  }
}

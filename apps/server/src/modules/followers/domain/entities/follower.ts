export class Follower {
  followerId: string;
  followeeId: string;

  constructor(model: Follower) {
    Object.assign(this, model);
  }
}

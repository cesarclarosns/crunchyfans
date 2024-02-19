export class FollowerCreatedEvent {
  followeeId: string;
  followerId: string;

  constructor(ev: { followeeId: string; followerId: string }) {
    this.followeeId = ev.followeeId;
    this.followerId = ev.followerId;
  }
}

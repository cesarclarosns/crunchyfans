export class FollowerCreatedDomainEvent {
  followerId: string;
  followeeId: string;

  constructor(event: FollowerCreatedDomainEvent) {
    Object.assign(this, event);
  }
}

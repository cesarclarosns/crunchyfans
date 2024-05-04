import { IEvent } from '@nestjs/cqrs';

export class FollowerCreatedEvent implements IEvent {
  constructor(
    readonly followerId: string,
    readonly followeeId: string,
  ) {}
}

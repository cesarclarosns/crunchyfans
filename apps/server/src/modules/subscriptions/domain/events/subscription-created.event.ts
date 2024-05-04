export class SubscriptionCreatedEvent {
  constructor(
    readonly subscriberId: string,
    readonly subscribeeId: string,
  ) {}
}

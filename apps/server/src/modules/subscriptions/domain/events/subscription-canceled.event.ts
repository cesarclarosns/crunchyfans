export class SubscriptionCanceledEvent {
  constructor(
    readonly subscriberId: string,
    readonly subscribeeId: string,
  ) {}
}

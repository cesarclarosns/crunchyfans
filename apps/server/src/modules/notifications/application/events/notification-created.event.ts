export class NotificationCreatedEvent {
  readonly notificationId: string;

  constructor(event: NotificationCreatedEvent) {
    Object.assign(this, event);
  }
}

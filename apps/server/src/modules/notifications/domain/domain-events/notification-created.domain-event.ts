export class NotificationCreatedDomainEvent {
  notificationId: string;

  constructor(ev: NotificationCreatedDomainEvent) {
    Object.assign(this, ev);
  }
}

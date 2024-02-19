export class NotificationCreatedEvent {
  user_id: string;
  notification: unknown;

  constructor({
    user_id,
    notification,
  }: {
    user_id: string;
    notification: unknown;
  }) {
    this.user_id = user_id;
    this.notification = notification;
  }
}

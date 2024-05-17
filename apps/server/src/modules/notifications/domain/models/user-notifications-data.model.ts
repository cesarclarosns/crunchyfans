export class UserNotificationsData {
  notificationsCount: number;

  constructor(model: UserNotificationsData) {
    Object.assign(this, model);
  }
}

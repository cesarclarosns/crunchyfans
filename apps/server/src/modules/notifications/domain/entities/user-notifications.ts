export class UserNotificationsData {
  unreadNotificationsCount: number;

  constructor(model: UserNotificationsData) {
    Object.assign(this, model);
  }
}

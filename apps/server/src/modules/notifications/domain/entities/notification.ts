export class Notification {
  id: string;
  userId: string;
  text: string;
  isRead: boolean;

  constructor(model: Notification) {
    Object.assign(this, model);
  }
}

export class Notification {
  readonly id: string;
  readonly userId: string;
  readonly text: string;
  readonly isRead: boolean;

  constructor(model: Notification) {
    Object.assign(this, model);
  }
}

import { ICommand } from '@nestjs/cqrs';

export class SendSocketNotificationCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly notificationId: string,
  ) {}
}

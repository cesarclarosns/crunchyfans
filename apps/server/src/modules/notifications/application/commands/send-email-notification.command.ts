import { ICommand } from '@nestjs/cqrs';

export class SendEmailNotificationCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly notificationId: string,
  ) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SendEmailNotificationCommand } from './send-email-notification.command';

@CommandHandler(SendEmailNotificationCommand)
export class SendEmailNotificationHandler
  implements ICommandHandler<SendEmailNotificationCommand>
{
  constructor(
    @InjectPinoLogger(SendEmailNotificationHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(command: SendEmailNotificationCommand): Promise<any> {}
}

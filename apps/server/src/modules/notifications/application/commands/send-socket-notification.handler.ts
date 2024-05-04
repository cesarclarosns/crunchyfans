import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SendSocketNotificationCommand } from './send-socket-notification.command';

@CommandHandler(SendSocketNotificationCommand)
export class SendSocketNotificationHandler
  implements ICommandHandler<SendSocketNotificationCommand>
{
  constructor(
    @InjectPinoLogger(SendSocketNotificationHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  async execute(command: SendSocketNotificationCommand): Promise<any> {
    this.logger.info(command);
  }
}

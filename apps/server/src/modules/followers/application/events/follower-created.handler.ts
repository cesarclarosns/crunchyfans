import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { FollowerCreatedEvent } from './follower-created.event';

@EventsHandler(FollowerCreatedEvent)
export class FollowerCreatedEventHandler
  implements IEventHandler<FollowerCreatedEvent>
{
  constructor(
    @InjectPinoLogger(FollowerCreatedEventHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  async handle(event: FollowerCreatedEvent) {
    this.logger.debug(event);
  }
}

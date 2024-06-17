import { OnEvent } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import {
  AuthDomainEvents,
  UserSignedInEvent,
} from '@/modules/auth/domain/domain-events';

export class UserSignedInConsumer {
  constructor(
    @InjectPinoLogger(UserSignedInConsumer.name)
    private readonly _logger: PinoLogger,
  ) {}

  @OnEvent(AuthDomainEvents.userSignedIn)
  async handle(event: UserSignedInEvent) {}
}

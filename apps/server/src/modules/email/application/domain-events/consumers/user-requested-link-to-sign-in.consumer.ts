import { OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export class UserRequestedLinkToSignInConsumer implements OnModuleInit {
  constructor(
    @InjectPinoLogger(UserRequestedLinkToSignInConsumer.name)
    private readonly _logger: PinoLogger,
  ) {}

  handle() {}

  async onModuleInit() {}
}

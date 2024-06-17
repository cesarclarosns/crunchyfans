import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { EmailService } from '@/modules/email/application/services/email.service';

export class UserCreatedConsumer {
  constructor(
    @InjectPinoLogger(UserCreatedConsumer.name)
    private readonly _logger: PinoLogger,
    private readonly _emailService: EmailService,
  ) {}

  handle() {}
}

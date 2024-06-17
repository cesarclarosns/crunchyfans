import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { SendEmailSignInWithLinkDto } from '@/modules/email/domain/dtos/send-email-sign-in-with-link.dto';
import { SendEmailSuccessfullSignInDto } from '@/modules/email/domain/dtos/send-email-successfull-sign-in.dto';
import { SendEmailWelcomeDto } from '@/modules/email/domain/dtos/send-email-welcome.dto';

export class EmailService {
  constructor(
    @InjectPinoLogger(EmailService.name)
    private readonly _logger: PinoLogger,
  ) {}

  async sendEmailSignInWithLink(dto: SendEmailSignInWithLinkDto) {}

  async sendEmailSuccessfullSignIn(dto: SendEmailSuccessfullSignInDto) {}

  async sendEmailWelcome(dto: SendEmailWelcomeDto) {}
}

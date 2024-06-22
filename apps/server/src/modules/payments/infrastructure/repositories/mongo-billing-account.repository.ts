import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class MongoBillingAccountRepository {
  constructor(
    @InjectPinoLogger(MongoBillingAccountRepository.name)
    private readonly _logger: PinoLogger,
  ) {}
}

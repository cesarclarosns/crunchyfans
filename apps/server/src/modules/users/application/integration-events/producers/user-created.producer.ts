import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserCreatedProducer {
  constructor(
    @InjectPinoLogger(UserCreatedProducer.name)
    private readonly _logger: PinoLogger,
  ) {}
}

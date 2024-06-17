import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class SocketService {
  constructor(
    @InjectPinoLogger(SocketService.name) private readonly _logger: PinoLogger,
  ) {}
}

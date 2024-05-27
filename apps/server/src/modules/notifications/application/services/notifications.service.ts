import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectPinoLogger(NotificationsService.name)
    private readonly _logger: PinoLogger,
  ) {}
}

import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class HealthService {
  constructor(
    @InjectPinoLogger(HealthService.name) private readonly logger: PinoLogger,
  ) {}

  getHealth() {
    return {
      status: 'up',
      timestamp: new Date(Date.now()).toISOString(),
      uptime: process.uptime(),
    };
  }
}

import { Controller } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('timelines')
export class TimelinesController {
  constructor(
    @InjectPinoLogger(TimelinesController.name)
    private readonly logger: PinoLogger,
  ) {}
}

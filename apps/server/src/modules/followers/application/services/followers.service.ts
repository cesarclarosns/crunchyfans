import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class FollowersService {
  constructor(
    @InjectPinoLogger(FollowersService.name)
    private readonly _logger: PinoLogger,
  ) {}
}

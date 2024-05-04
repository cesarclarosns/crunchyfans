import { Controller, Get } from '@nestjs/common';

import { Public } from '@/modules/auth/application/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor() {}

  @Public()
  @Get()
  getHealth() {
    return {
      status: 'up',
      timestamp: new Date(Date.now()).toISOString(),
      uptime: process.uptime(),
    };
  }
}

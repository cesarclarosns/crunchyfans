import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'up',
      timestamp: new Date(Date.now()).toISOString(),
      uptime: process.uptime(),
    };
  }
}

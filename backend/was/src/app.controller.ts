import { Controller, Get } from '@nestjs/common';
import { HealthCheckDecorator } from './app.decorators';

@Controller()
export class AppController {
  @Get('/health-check')
  @HealthCheckDecorator()
  healthCheck(): boolean {
    return true;
  }
}

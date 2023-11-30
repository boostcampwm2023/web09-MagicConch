import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [EventsModule, LoggerModule],
})
export class AppModule {}

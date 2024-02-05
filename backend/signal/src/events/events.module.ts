import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [LoggerModule],
  providers: [EventsGateway, LoggerService],
})
export class EventsModule {}

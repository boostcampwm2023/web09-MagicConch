import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [LoggerModule],
  providers: [EventsGateway, LoggerService],
})
export class EventsModule {}

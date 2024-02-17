import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule,
    LoggerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

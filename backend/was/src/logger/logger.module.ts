import { winstonLogger } from 'winston-logger';
import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: 'WINSTON',
      useValue: winstonLogger('WAS'),
    },
    LoggerService,
  ],
  exports: ['WINSTON', LoggerService],
})
export class LoggerModule {}

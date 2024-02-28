import { Module } from '@nestjs/common';
import { winstonLogger } from 'winston-logger';
import { LoggerService } from './logger.service';

@Module({
  providers: [
    {
      provide: 'WINSTON',
      useValue: winstonLogger('SIGNAL'),
    },
    LoggerService,
  ],
  exports: ['WINSTON', LoggerService],
})
export class LoggerModule {}

import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { winstonLogger } from './winston/winston.logger';

@Module({
  providers: [
    {
      provide: 'WINSTON',
      useValue: winstonLogger,
    },
    LoggerService,
  ],
  exports: ['WINSTON', LoggerService],
})
export class LoggerModule {}

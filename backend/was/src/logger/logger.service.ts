import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService {
  constructor(@Inject('WINSTON') private readonly logger: Logger) {}

  log(message: string) {
    this.logger.log('info', message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}

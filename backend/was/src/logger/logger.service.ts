import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggerService implements OnApplicationShutdown {
  constructor(@Inject('WINSTON') private readonly logger: Logger) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.close();
  }

  log(message: string) {
    this.logger.log('info', message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message}${trace ? `\n${trace}` : ''}`);
  }
}

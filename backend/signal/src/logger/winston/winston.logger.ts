import { Logger, createLogger } from 'winston';
import { customFormat } from './winston.format';
import {
  debugTransports,
} from './winston.transports';

export const winstonLogger: Logger = createLogger({
  format: customFormat,
  transports: [
    debugTransports,
  ],
});

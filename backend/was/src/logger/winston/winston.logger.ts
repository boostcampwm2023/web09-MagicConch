import { Logger, createLogger } from 'winston';
import { customFormat } from './winston.format';
import {
  debugTransports,
  errorTransports,
  fatalTransports,
  infoTransports,
  warnTransports,
} from './winston.transports';

export const winstonLogger: Logger = createLogger({
  format: customFormat,
  transports: [
    debugTransports,
    infoTransports,
    warnTransports,
    errorTransports,
    fatalTransports,
  ],
});

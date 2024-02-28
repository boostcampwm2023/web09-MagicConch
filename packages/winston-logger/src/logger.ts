import { Logger, createLogger } from 'winston';
import { customFormat } from './format';
import {
  debugTransports,
  errorTransports,
  infoTransports,
  warnTransports,
} from './transports';

export const winstonLogger = (service: string): Logger =>
  createLogger({
    format: customFormat(service),
    transports: [
      debugTransports,
      infoTransports,
      warnTransports,
      errorTransports,
    ],
  });

import { Logger, createLogger, format } from 'winston';
import {
  debugTransports,
  errorTransports,
  fatalTransports,
  infoTransports,
  warnTransports,
} from './winston.transports';

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp}\t[${level}] : ${message}`;
});

export const winstonLogger: Logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    customFormat,
  ),

  transports: [
    debugTransports,
    infoTransports,
    warnTransports,
    errorTransports,
    fatalTransports,
  ],
});

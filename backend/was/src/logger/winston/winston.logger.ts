import { Logger, createLogger, format } from 'winston';
import {
  debugTransports,
  errorTransports,
  fatalTransports,
  infoTransports,
  warnTransports,
} from './winston.transports';

const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  const logMessage: string = `[WAS]\t${timestamp}\t[${level}] : ${message}`;
  if (stack) {
    return `${logMessage}\n${stack}`;
  }
  return logMessage;
});

export const winstonLogger: Logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
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

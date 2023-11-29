import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

function createDailyRotateFile(level: string): DailyRotateFile {
  return new DailyRotateFile({
    level: level,
    dirname: 'logs',
    filename: `${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });
}

export const debugTransports: transports.ConsoleTransportInstance =
  new transports.Console({
    level: 'debug',
  });

export const infoTransports: DailyRotateFile = createDailyRotateFile('info');
export const warnTransports: DailyRotateFile = createDailyRotateFile('warn');
export const errorTransports: DailyRotateFile = createDailyRotateFile('error');
export const fatalTransports: DailyRotateFile = createDailyRotateFile('fatal');

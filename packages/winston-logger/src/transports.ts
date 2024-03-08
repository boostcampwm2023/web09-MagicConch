import * as fs from 'fs';
import { transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const dirname: string = 'logs';

function createDailyRotateFile(level: string): DailyRotateFile {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  return new DailyRotateFile({
    level: level,
    dirname: dirname,
    filename: `${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });
}

export const debugTransports = new transports.Console({
  level: 'debug',
});
export const infoTransports: DailyRotateFile = createDailyRotateFile('info');
export const warnTransports: DailyRotateFile = createDailyRotateFile('warn');
export const errorTransports: DailyRotateFile = createDailyRotateFile('error');

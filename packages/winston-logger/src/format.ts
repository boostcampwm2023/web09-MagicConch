import { format } from 'winston';

const printfFormat = (prefix: string) =>
  format.printf(({ level, message, timestamp, stack }) => {
    const logMessage: string = `[${prefix}]\t${timestamp}\t[${level}] : ${message}`;
    if (stack) {
      return `${logMessage}\n${stack}`;
    }
    return logMessage;
  });

export const customFormat = (prefix: string) =>
  format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize(),
    printfFormat(prefix),
  );

import { format } from 'winston';

const printfFormat = format.printf(({ level, message, timestamp, stack }) => {
  const logMessage: string = `[WAS]\t${timestamp}\t[${level}] : ${message}`;
  if (stack) {
    return `${logMessage}\n${stack}`;
  }
  return logMessage;
});

export const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.colorize(),
  printfFormat,
);

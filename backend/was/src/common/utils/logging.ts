import { LoggerService } from '@logger/logger.service';

export function makeErrorLogMessage(logMessage: string, err: any): string {
  const errorMessage: string =
    err instanceof Error ? err.message : JSON.stringify(err);
  return `${logMessage} : ${err.message || errorMessage}`;
}

export function logErrorWithStack(
  logger: LoggerService,
  message: string,
  stack: string,
) {
  logger.error(message, stack);
}

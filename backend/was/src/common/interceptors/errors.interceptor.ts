import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from 'src/logger/logger.service';
import { QueryFailedError } from 'typeorm';
import { ERR_MSG } from '../constants/errors';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controllerName: string = context.getClass().name;
    const methodName: string = context.getHandler().name;
    const logMessage: string = `Failed to execute <${controllerName} - ${methodName}>`;

    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof QueryFailedError) {
          return throwError(() =>
            this.handleQueryFailedError(
              err,
              this.makeErrorLogMessage(logMessage, err),
            ),
          );
        }

        this.logger.error(this.makeErrorLogMessage(logMessage, err));
        if (err instanceof Error) {
          return throwError(() => err);
        }
        return throwError(() => new Error(ERR_MSG.UNKNOWN));
      }),
    );
  }

  /**
   * TypeORM Exception
   */
  private handleQueryFailedError(
    err: QueryFailedError,
    logMessage: string,
  ): Error {
    const isFatal: boolean = err.message.includes('ETIMEOUT');
    this.logQueryFailedError(logMessage, isFatal, err.stack);

    if (err.message.includes('ETIMEOUT')) {
      return new Error(ERR_MSG.ETIMEOUT);
    }
    if (err.message.includes('UNIQUE')) {
      return new Error(ERR_MSG.NOT_UNIQUE);
    }
    if (err.message.includes('FOREIGN KEY')) {
      throw new Error(ERR_MSG.INVALID_FOREIGN_KEY);
    }
    if (err.message.includes('optimistic lock')) {
      throw new Error(ERR_MSG.OPTIMISTIC_LOCK);
    }
    return new Error(ERR_MSG.UNKNOWN_DATABASE);
  }

  private logQueryFailedError(
    logMessage: string,
    isFatal: boolean,
    trace?: string,
  ): void {
    if (isFatal) {
      return this.logger.fatal(logMessage, trace);
    }
    this.logger.error(logMessage, trace);
  }

  private makeErrorLogMessage(logMessage: string, err: any): string {
    return `${logMessage} : ${err.message || ERR_MSG.UNKNOWN}`;
  }
}

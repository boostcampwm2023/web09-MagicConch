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
          this.logger.error(`${logMessage} : ${err.message}`, err.stack);
          return throwError(() => this.handleQueryFailedError(err));
        }

        if (err instanceof Error) {
          this.logger.error(
            `${logMessage} : ${err.message || ERR_MSG.UNKNOWN}`,
          );
          return throwError(() => err);
        }

        this.logger.error(`${logMessage} : ${ERR_MSG.UNKNOWN}`);
        return throwError(() => new Error(ERR_MSG.UNKNOWN));
      }),
    );
  }

  /**
   * TypeORM Exception
   */
  private handleQueryFailedError(err: QueryFailedError): Error {
    if (err.message.includes('UNIQUE')) {
      return new Error(ERR_MSG.NOT_UNIQUE);
    }
    if (err.message.includes('optimistic lock')) {
      throw new Error(ERR_MSG.OPTIMISTIC_LOCK);
    }
    return new Error(ERR_MSG.UNKNOWN_DATABASE);
  }
}

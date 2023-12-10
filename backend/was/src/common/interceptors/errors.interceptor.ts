import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/client';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from 'src/logger/logger.service';
import { QueryFailedError } from 'typeorm';
import { ERR_MSG } from '../constants/errors';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly slackWebhook: IncomingWebhook;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.slackWebhook = new IncomingWebhook(
      this.configService.get('SLACK_WEBHOOK_FOR_BE') || '',
    );
  }

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
    this.sendSlackNotification(err);

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
    return `${logMessage} : ${err.message || err}`;
  }

  private sendSlackNotification(err: QueryFailedError) {
    Sentry.captureException(err);
    this.slackWebhook.send({
      attachments: [
        {
          color: 'danger',
          text: '📢 QueryFailedError 버그 발생',
          fields: [
            {
              title: `Error Message: ${err.message}`,
              value: err.stack || '',
              short: false,
            },
          ],
          ts: Math.floor(new Date().getTime() / 1000).toString(),
        },
      ],
    });
  }
}

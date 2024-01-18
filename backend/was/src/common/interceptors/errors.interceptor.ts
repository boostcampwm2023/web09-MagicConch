import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
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
import { logErrorWithStack, makeErrorLogMessage } from '../utils/logging';
import { makeSlackMessage } from '../utils/slack-webhook';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly slackWebhook: IncomingWebhook;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.slackWebhook = new IncomingWebhook(
      this.configService.get('SLACK_WEBHOOK_URI_FOR_WAS') || '',
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const controllerName: string = context.getClass().name;
    const methodName: string = context.getHandler().name;
    const logContext: string = `Failed to execute <${controllerName} - ${methodName}>`;

    return next.handle().pipe(
      catchError((err: unknown) => {
        const logMessage: string = makeErrorLogMessage(logContext, err);

        if (err instanceof QueryFailedError) {
          return throwError(() => this.handleQueryFailedError(err, logMessage));
        }

        this.logger.error(logMessage);
        if (err instanceof Error) {
          return throwError(() => err);
        }
        return throwError(() => new Error(ERR_MSG.UNKNOWN));
      }),
    );
  }

  private handleQueryFailedError(
    err: QueryFailedError,
    logMessage: string,
  ): void {
    this.sendNotification('📢 QueryFailedError 버그 발생', err);
    logErrorWithStack(this.logger, logMessage, err.stack ?? '');
    throw new InternalServerErrorException();
  }

  private sendNotification(text: string, err: Error): void {
    Sentry.captureException(err);
    this.slackWebhook.send(makeSlackMessage(text, err));
  }
}

import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export function setupSentry(app: INestApplication, dsn: string): void {
  Sentry.init({
    dsn: dsn,
    integrations: [new ProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.errorHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.requestHandler());
}

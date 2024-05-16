import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export function setupSentry(app: INestApplication, dsn: string): void {
  Sentry.init({
    dsn: dsn,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.3,
    profilesSampleRate: 0.3,
  });

  Sentry.setupExpressErrorHandler(app);
}

import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSentry } from '@config/sentry.setting';
import { setupSwagger } from '@config/swagger.setting';
import { LoggerService } from '@logger/logger.service';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const port: number = parseInt(process.env.PORT || '3000');
  const dsn: string = process.env.SENTRY_DSN || '';

  const logger: LoggerService = app.get(LoggerService);

  app.enableCors({
    origin: process.env.CORS_ALLOW_DOMAIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-type', 'samesite'],
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);

  setupSentry(app, dsn);
  if (process.env.ENV === 'DEV') {
    setupSwagger(app);
  }

  const server: any = await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');

    await server.close();
    await app.close();
    process.exit(0);
  });
}

bootstrap();

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSentry } from './common/config/sentry.setting';
import { setupSwagger } from './common/config/swagger.setting';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ALLOW_DOMAIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-type'],
  });
  app.enableShutdownHooks();

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  const dsn: string = process.env.SENTRY_DSN || '';
  setupSentry(app, dsn);
  setupSwagger(app);

  const port: number = parseInt(process.env.PORT || '3000');
  const server: any = await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');

    await server.close();
    await app.close();

    process.exit(0);
  });
}
bootstrap();

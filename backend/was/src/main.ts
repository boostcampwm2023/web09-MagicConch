import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { setupSentry } from './common/config/sentry.setting';
import { setupSwagger } from './common/config/swagger.setting';
import { LoggerService } from './logger/logger.service';

dotenv.config();

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const origin: string = process.env.CORS_ALLOW_DOMAIN ?? '';
  const port: number = parseInt(process.env.PORT || '3000');
  const dsn: string = process.env.SENTRY_DSN || '';

  const logger: LoggerService = app.get(LoggerService);

  app.enableCors({
    origin: origin,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-type'],
  });
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(logger);

  setupSentry(app, dsn);
  setupSwagger(app);

  const server: any = await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');

    await server.close();
    await app.close();
    process.exit(0);
  });
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger: LoggerService = app.get(LoggerService);

  app.enableCors({
    origin: process.env.CORS_ALLOW_DOMAIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-type', 'samesite'],
  });

  app.useLogger(logger);

  const port: number = parseInt(process.env.PORT || '3001');
  const server: any = await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');

    await server.close();
    await app.close();

    process.exit(0);
  });
}
bootstrap();

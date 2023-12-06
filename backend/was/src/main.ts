import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config/swagger.setting';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  setupSwagger(app);

  const port: number = parseInt(process.env.PORT || '3000');
  const server: any = await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');

    server.close();
    await app.close();

    logger.log('🖐️ Nest Application closed gracefully...');
    process.exit(0);
  });
}
bootstrap();

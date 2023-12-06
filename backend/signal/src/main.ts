import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  const port: number = parseInt(process.env.PORT || '3001');
  await app.listen(port);

  process.on('SIGTERM', async () => {
    logger.log('🖐️ Received SIGTERM signal. Start Graceful Shutdown...');
    await app.close();

    logger.log('🖐️ Nest Application closed gracefully...');
    process.exit(0);
  });
}
bootstrap();

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(LoggerService));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const configService: ConfigService = app.get(ConfigService);
  const wasPort: number = configService.get<number>('WAS_PORT') || 3000;
  const port: number = wasPort + 1;
  await app.listen(port);
}
bootstrap();

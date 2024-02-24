import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisCacheModule } from '@config/cache/redis-cache.module';
import { MysqlModule } from '@config/database/mysql.module';
import { JwtConfigModule } from '@config/jwt/jwt.module';
import { ErrorsInterceptor } from '@interceptors/errors.interceptor';
import { LoggerModule } from '@logger/logger.module';
import { AuthModule } from '@auth/auth.module';
import { ChatModule } from '@chat/chat.module';
import { ChatbotModule } from '@chatbot/chatbot.module';
import { MembersModule } from '@members/members.module';
import { SocketModule } from '@socket/socket.module';
import { TarotModule } from '@tarot/tarot.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisCacheModule.register(),
    JwtConfigModule.register(),
    MembersModule,
    MysqlModule,
    ChatModule,
    TarotModule,
    ChatbotModule,
    SocketModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}

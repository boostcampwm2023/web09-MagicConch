import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CacheConfigModule } from './common/config/cache/cache.module';
import { DatabaseModule } from './common/config/database/database.module';
import { JwtConfigModule } from './common/config/jwt/jwt.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { LoggerModule } from './logger/logger.module';
import { MembersModule } from './members/members.module';
import { SocketModule } from './socket/socket.module';
import { WsExceptionFilter } from './socket/ws-exception.filter';
import { TarotModule } from './tarot/tarot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheConfigModule.register(),
    JwtConfigModule.register(),
    MembersModule,
    DatabaseModule,
    ChatModule,
    TarotModule,
    ChatbotModule,
    SocketModule,
    LoggerModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: WsExceptionFilter,
    },
  ],
})
export class AppModule {}

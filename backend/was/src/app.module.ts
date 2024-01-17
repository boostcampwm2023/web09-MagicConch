import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { RedisCacheModule } from './common/config/cache/redis-cache.module';
import { MysqlModule } from './common/config/database/mysql.module';
import { JwtConfigModule } from './common/config/jwt/jwt.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';
import { MembersModule } from './members/members.module';
import { TarotModule } from './tarot/tarot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisCacheModule.register(),
    JwtConfigModule.register(),
    MembersModule,
    MysqlModule,
    ChatModule,
    TarotModule,
    EventsModule,
    LoggerModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}

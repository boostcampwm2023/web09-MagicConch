import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './common/config/database/database.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';
import { MembersModule } from './members/members.module';
import { TarotModule } from './tarot/tarot.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MembersModule,
    DatabaseModule,
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

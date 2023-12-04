import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './common/config/database/database.module';
import { ErrorsInterceptor } from './common/interceptors/error.interceptor';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './logger/logger.module';
import { Member } from './members/entities/member.entity';
import { MembersModule } from './members/members.module';
import { MembersService } from './members/members.service';
import { TarotModule } from './tarot/tarot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MembersModule,
    DatabaseModule,
    ChatModule,
    TarotModule,
    TypeOrmModule.forFeature([Member]),
    EventsModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    MembersService,
  ],
})
export class AppModule {}

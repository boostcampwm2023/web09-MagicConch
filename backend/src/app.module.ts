import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './common/config/database/database.module';
import { EventsModule } from './events/events.module';
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
    TarotModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [MembersService],
})
export class AppModule {}

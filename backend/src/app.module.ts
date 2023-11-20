import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './common/config/database/database.module';
import { EventsModule } from './events/events.module';
import { Member } from './members/entities/member.entity';
import { TarotModule } from './tarot/tarot.module';

@Module({
  imports: [EventsModule],
})
export class AppModule {}

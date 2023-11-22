import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { ChatModule } from 'src/chat/chat.module';
import { DatabaseModule } from 'src/common/config/database/database.module';
import { EventsModule } from 'src/events/events.module';
import { Member } from 'src/members/entities/member.entity';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { TarotModule } from 'src/tarot/tarot.module';
import { __DEV__ } from './node.env';

const devAppModules = {
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventsModule],
};

const prodAppModules = {
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MembersModule,
    DatabaseModule,
    ChatModule,
    TarotModule,
    TypeOrmModule.forFeature([Member]),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [MembersService],
};

@Module(__DEV__ ? devAppModules : prodAppModules)
export class AppModule {}

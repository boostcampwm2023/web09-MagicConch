import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from 'src/chat/chat.service';
import { ChattingMessage } from 'src/chat/entities/chatting-message.entity';
import { ChattingRoom } from 'src/chat/entities/chatting-room.entity';
import { Member } from 'src/members/entities/member.entity';
import { TarotCardPack } from 'src/tarot/entities/tarot-card-pack.entity';
import { TarotCard } from 'src/tarot/entities/tarot-card.entity';
import { TarotResult } from 'src/tarot/entities/tarot-result.entity';
import { TarotService } from 'src/tarot/tarot.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      ChattingMessage,
      ChattingRoom,
      TarotResult,
      TarotCard,
      TarotCardPack,
    ]),
  ],
  providers: [EventsGateway, ChatService, TarotService],
})
export class EventsModule {}

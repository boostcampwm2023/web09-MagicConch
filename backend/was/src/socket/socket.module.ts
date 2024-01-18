// socket.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChattingMessage } from 'src/chat/entities/chatting-message.entity';
import { ChattingRoom } from 'src/chat/entities/chatting-room.entity';
import { ChatbotModule } from 'src/chatbot/chatbot.module';
import { LoggerModule } from 'src/logger/logger.module';
import { Member } from 'src/members/entities/member.entity';
import { TarotCardPack } from 'src/tarot/entities/tarot-card-pack.entity';
import { TarotCard } from 'src/tarot/entities/tarot-card.entity';
import { TarotResult } from 'src/tarot/entities/tarot-result.entity';
import { ChatService } from '../chat/chat.service';
import { LoggerService } from '../logger/logger.service';
import { TarotService } from '../tarot/tarot.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

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
    LoggerModule,
    ChatbotModule,
  ],
  providers: [
    SocketGateway,
    SocketService,
    ChatService,
    TarotService,
    LoggerService,
  ],
})
export class SocketModule {}

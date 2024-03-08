// socket.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@logger/logger.module';
import { LoggerService } from '@logger/logger.service';
import { ChatService } from '@chat/chat.service';
import { ChattingMessage } from '@chat/entities/chatting-message.entity';
import { ChattingRoom } from '@chat/entities/chatting-room.entity';
import { ChatbotModule } from '@chatbot/chatbot.module';
import { Member } from '@members/entities/member.entity';
import { TarotCardPack } from '@tarot/entities/tarot-card-pack.entity';
import { TarotCard } from '@tarot/entities/tarot-card.entity';
import { TarotResult } from '@tarot/entities/tarot-result.entity';
import { TarotService } from '@tarot/tarot.service';
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

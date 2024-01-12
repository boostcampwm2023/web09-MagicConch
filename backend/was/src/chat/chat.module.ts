import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingRoom, ChattingMessage, Member])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

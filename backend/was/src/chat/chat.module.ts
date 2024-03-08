import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@members/entities';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChattingMessage, ChattingRoom } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ChattingRoom, ChattingMessage, Member])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

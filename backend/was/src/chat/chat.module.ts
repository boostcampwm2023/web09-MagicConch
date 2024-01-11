import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: { expiresIn: 'JWT_EXPIRES_IN' },
        };
      },
    }),
    TypeOrmModule.forFeature([ChattingRoom, ChattingMessage, Member]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

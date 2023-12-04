import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { Message } from 'src/events/type';

export class CreateChattingMessageDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  readonly roomId: string;

  @IsBoolean()
  @ApiProperty({ description: '호스트 여부', required: true })
  readonly isHost: boolean;

  @IsString()
  @ApiProperty({
    description: '채팅 메시지',
    minLength: 1,
    maxLength: 1000,
    required: true,
  })
  readonly message: string;

  static fromMessage(message: Message): CreateChattingMessageDto {
    return {
      roomId: message.roomId,
      isHost: message.chat.role === 'assistant',
      message: message.chat.content,
    };
  }
}

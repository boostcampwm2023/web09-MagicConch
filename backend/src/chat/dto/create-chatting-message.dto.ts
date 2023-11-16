import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateChattingMessageDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  roomId: string;

  @IsBoolean()
  @ApiProperty({ description: '호스트 여부', required: true })
  isHost: boolean;

  @IsString()
  @ApiProperty({
    description: '채팅 메시지',
    minLength: 1,
    maxLength: 1000,
    required: true,
  })
  message: string;
}

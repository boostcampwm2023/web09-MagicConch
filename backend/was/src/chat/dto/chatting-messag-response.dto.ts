import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class ChattingMessageResponseDto {
  @IsUUID()
  @ApiProperty({ description: '채팅 메시지 ID', required: true })
  id: string;

  @IsBoolean()
  @ApiProperty({ description: '호스트 여부', required: true })
  isHost: boolean;

  @IsString()
  @ApiProperty({ description: '채팅 메시지', required: true })
  message: string;
}

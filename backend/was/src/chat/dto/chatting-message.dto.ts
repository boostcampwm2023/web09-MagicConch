import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChattingMessage } from '../entities';

export class ChattingMessageDto {
  @IsBoolean()
  @ApiProperty({ description: '호스트 여부', required: true })
  readonly isHost: boolean;

  @IsString()
  @ApiProperty({ description: '채팅 메시지', required: true })
  readonly message: string;

  static fromEntity(entity: ChattingMessage): ChattingMessageDto {
    return { isHost: entity.isHost, message: entity.message };
  }
}

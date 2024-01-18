import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import { ChattingMessage } from '../entities';

export class ChattingMessageResponseDto {
  @IsUUID()
  @ApiProperty({ description: '채팅 메시지 ID', required: true })
  readonly id: string;

  @IsBoolean()
  @ApiProperty({ description: '호스트 여부', required: true })
  readonly isHost: boolean;

  @IsString()
  @ApiProperty({ description: '채팅 메시지', required: true })
  readonly message: string;

  static fromEntity(entity: ChattingMessage): ChattingMessageResponseDto {
    return { ...entity };
  }
}

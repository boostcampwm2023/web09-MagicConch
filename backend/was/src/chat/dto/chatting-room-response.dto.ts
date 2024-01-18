import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ChattingRoom } from '../entities';

export class ChattingRoomResponseDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  readonly id: string;

  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  readonly title: string;

  static fromEntity(entity: ChattingRoom): ChattingRoomResponseDto {
    return { ...entity };
  }
}

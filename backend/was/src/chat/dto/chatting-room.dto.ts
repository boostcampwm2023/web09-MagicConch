import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ChattingRoom } from '../entities';

export class ChattingRoomDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  readonly id: string;

  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  readonly title: string;

  static fromEntity(entity: ChattingRoom): ChattingRoomDto {
    return { ...entity };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ChattingRoomResponseDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  id: string;

  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  title: string;
}

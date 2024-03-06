import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChattingRoomDto {
  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  title: string;
}

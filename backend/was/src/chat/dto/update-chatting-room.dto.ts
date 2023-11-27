import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateChattingRoomDto {
  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  title: string;
}

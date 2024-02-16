import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsString, IsUUID } from 'class-validator';
import { ChattingRoom } from '../entities';

export class ChattingRoomDto {
  @IsUUID()
  @ApiProperty({ description: '채팅방 ID', required: true })
  readonly id: string;

  @IsString()
  @ApiProperty({ description: '채팅방 제목', required: true })
  readonly title?: string;

  @IsDate()
  @ApiProperty({ description: '채팅일자', required: true })
  readonly createdAt?: string;

  static fromEntity(entity: ChattingRoom): ChattingRoomDto {
    return {
      id: entity.id,
      title: entity.title ?? entity.createdAt?.toLocaleDateString('ko-KR'),
      createdAt: entity.createdAt?.toLocaleDateString('ko-KR'),
    };
  }
}

export class ChattingRoomGroupDto {
  @IsString()
  @ApiProperty({ description: '특정 일자', required: true })
  readonly date?: string;

  @IsArray()
  @ApiProperty({
    description: '특정 일자의 채팅방 목록',
    type: ChattingRoomDto,
    isArray: true,
    required: true,
  })
  readonly rooms: ChattingRoomDto[] = [];

  static makeGroup(date: string, dto: ChattingRoomDto): ChattingRoomGroupDto {
    return {
      date: date,
      rooms: [dto],
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { Repository } from 'typeorm';
import { ChattingMessageResponseDto } from './dto/chatting-messag-response.dto';
import { ChattingRoomResponseDto } from './dto/chatting-room-response.dto';
import { CreateChattingMessageDto } from './dto/create-chatting-message.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
    @InjectRepository(ChattingMessage)
    private readonly chattingMessageRepository: Repository<ChattingMessage>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async createRoom(memberId: string): Promise<string> {
    const member: Member | null = await this.membersRepository.findOneBy({
      id: memberId,
    });
    if (!member) {
      throw new NotFoundException();
    }
    const room: ChattingRoom = new ChattingRoom();
    room.participant = member;
    try {
      const savedRoom: ChattingRoom =
        await this.chattingRoomRepository.save(room);
      return savedRoom.id;
    } catch (err: unknown) {
      throw err;
    }
  }

  async createMessage(
    roomId: string,
    createChattingMessageDto: CreateChattingMessageDto[],
  ): Promise<void> {
    const room = await this.chattingRoomRepository.findOneBy({
      id: roomId,
    });
    if (!room) {
      throw new NotFoundException();
    }
    try {
      createChattingMessageDto.forEach(
        async (messageDto: CreateChattingMessageDto) => {
          const message = new ChattingMessage();
          message.roomId = room;
          message.isHost = messageDto.isHost;
          message.message = messageDto.message;
          await this.chattingMessageRepository.save(message);
        },
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async findRoomsById(id: string): Promise<ChattingRoomResponseDto[]> {
    const rooms: ChattingRoom[] = await this.chattingRoomRepository.findBy({
      id,
    });
    return rooms.map((room: ChattingRoom) => {
      const roomDto: ChattingRoomResponseDto = new ChattingRoomResponseDto();
      roomDto.id = room.id;
      roomDto.title = room.title;
      return roomDto;
    });
  }

  async findMessagesById(id: string): Promise<ChattingMessageResponseDto[]> {
    const messages: ChattingMessage[] =
      await this.chattingMessageRepository.findBy({ id });
    return messages.map((message: ChattingMessage) => {
      const messageDto = new ChattingMessageResponseDto();
      messageDto.id = message.id;
      messageDto.isHost = message.isHost;
      messageDto.message = message.message;
      return messageDto;
    });
  }

  async updateRoom(
    id: string,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException();
    }
    room.title = updateChattingRoomDto.title;
    try {
      await this.chattingRoomRepository.save(room);
    } catch (err: unknown) {
      throw err;
    }
  }

  async removeRoom(id: string): Promise<void> {
    try {
      await this.chattingRoomRepository.softDelete({ id });
    } catch (err: unknown) {
      throw err;
    }
  }
}

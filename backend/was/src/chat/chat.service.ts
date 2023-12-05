import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { Member } from 'src/members/entities/member.entity';
import { Repository } from 'typeorm';
import { ChattingMessageResponseDto } from './dto/chatting-message-response.dto';
import { ChattingRoomResponseDto } from './dto/chatting-room-response.dto';
import { CreateChattingMessageDto } from './dto/create-chatting-message.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

export interface ChattingInfo {
  memeberId: string;
  roomId: string;
}

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

  async createRoom(memberId: string): Promise<ChattingInfo> {
    /**
     * 임시로 쿠키 대신 사용
     */
    const member: Member = new Member();
    const savedMember: Member = await this.membersRepository.save(member);

    // const member: Member | null = await this.membersRepository.findOneBy({
    //   id: memberId,
    // });
    // if (!member) {
    //   throw new NotFoundException();
    // }

    const room: ChattingRoom = new ChattingRoom();
    room.participant = savedMember;

    try {
      const savedRoom: ChattingRoom =
        await this.chattingRoomRepository.save(room);
      return { memeberId: savedMember.id, roomId: savedRoom.id };
    } catch (err: unknown) {
      throw err;
    }
  }

  async createMessage(
    roomId: string,
    createChattingMessageDto: CreateChattingMessageDto[],
  ): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({
        id: roomId,
      });
    if (!room) {
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
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
    return rooms.map((room: ChattingRoom) =>
      ChattingRoomResponseDto.fromEntity(room),
    );
  }

  async findMessagesById(id: string): Promise<ChattingMessageResponseDto[]> {
    const messages: ChattingMessage[] =
      await this.chattingMessageRepository.findBy({ id });
    return messages.map((message: ChattingMessage) =>
      ChattingMessageResponseDto.fromEntity(message),
    );
  }

  async updateRoom(
    id: string,
    memberId: string,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      throw new ForbiddenException(ERR_MSG.UPDATE_CHATTING_ROOM_FORBIDDEN);
    }
    try {
      await this.chattingRoomRepository.update(
        { id },
        { title: updateChattingRoomDto.title },
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async removeRoom(id: string, memberId: string): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      throw new ForbiddenException(ERR_MSG.DELETE_CHATTING_ROOM_FORBIDDEN);
    }
    try {
      await this.chattingRoomRepository.softDelete({ id });
    } catch (err: unknown) {
      throw err;
    }
  }
}

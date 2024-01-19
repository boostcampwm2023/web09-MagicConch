import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayloadDto } from 'src/auth/dto';
import { ERR_MSG } from 'src/common/constants/errors';
import { Member } from 'src/members/entities';
import { Repository } from 'typeorm';
import {
  ChattingMessageResponseDto,
  ChattingRoomResponseDto,
  CreateChattingMessageDto,
  UpdateChattingRoomDto,
} from './dto';
import { ChattingMessage, ChattingRoom } from './entities';

export interface ChattingInfo {
  memeberId: string;
  roomId: string;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
    @InjectRepository(ChattingMessage)
    private readonly chattingMessageRepository: Repository<ChattingMessage>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async createRoom(token: string): Promise<ChattingInfo> {
    return token
      ? this.createRoomForMember(token)
      : this.createRoomForNonMember();
  }

  async createMessages(
    roomId: string,
    createMessageDtos: CreateChattingMessageDto[],
  ): Promise<void> {
    try {
      const room: ChattingRoom | null =
        await this.chattingRoomRepository.findOneBy({
          id: roomId,
        });
      if (!room) {
        throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
      }
      for (const createMessageDto of createMessageDtos) {
        const message: ChattingMessage = ChattingMessage.fromDto(
          createMessageDto,
          room,
        );
        await this.chattingMessageRepository.save(message);
      }
    } catch (err: unknown) {
      throw err;
    }
  }

  async findRoomsById(id: string): Promise<ChattingRoomResponseDto[]> {
    try {
      const rooms: ChattingRoom[] = await this.chattingRoomRepository.findBy({
        id: id,
      });
      return rooms.map((room: ChattingRoom) =>
        ChattingRoomResponseDto.fromEntity(room),
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async findMessagesById(id: string): Promise<ChattingMessageResponseDto[]> {
    try {
      const messages: ChattingMessage[] =
        await this.chattingMessageRepository.findBy({ id: id });
      return messages.map((message: ChattingMessage) =>
        ChattingMessageResponseDto.fromEntity(message),
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async updateRoom(
    id: string,
    memberId: string,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    try {
      const room: ChattingRoom | null =
        await this.chattingRoomRepository.findOneBy({ id: id });
      if (!room) {
        throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
      }
      if (room.participant.id !== memberId) {
        throw new ForbiddenException(ERR_MSG.UPDATE_CHATTING_ROOM_FORBIDDEN);
      }
      await this.chattingRoomRepository.update(
        { id: id },
        { title: updateChattingRoomDto.title },
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async removeRoom(id: string, memberId: string): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id: id });
    if (!room) {
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      throw new ForbiddenException(ERR_MSG.DELETE_CHATTING_ROOM_FORBIDDEN);
    }
    try {
      await this.chattingRoomRepository.softDelete({ id: id });
    } catch (err: unknown) {
      throw err;
    }
  }

  private async createRoomForMember(token: string): Promise<ChattingInfo> {
    try {
      const payload: JwtPayloadDto = this.jwtService.verify(token);
      const member: Member | null = await this.membersRepository.findOneBy({
        email: payload.email,
        providerId: payload.providerId,
      });
      if (!member) {
        throw new BadRequestException();
      }
      const room: ChattingRoom = await this.chattingRoomRepository.save(
        ChattingRoom.fromMember(member),
      );
      return { memeberId: member.id, roomId: room.id };
    } catch (err: unknown) {
      throw err;
    }
  }

  private async createRoomForNonMember(): Promise<ChattingInfo> {
    try {
      const member: Member = await this.membersRepository.save(new Member());
      const room: ChattingRoom = await this.chattingRoomRepository.save(
        ChattingRoom.fromMember(member),
      );
      return { memeberId: member.id, roomId: room.id };
    } catch (err: unknown) {
      throw err;
    }
  }
}

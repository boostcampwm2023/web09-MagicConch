import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { Member } from 'src/members/entities';
import { Repository } from 'typeorm';
import {
  ChattingMessageDto,
  ChattingRoomDto,
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
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
    @InjectRepository(ChattingMessage)
    private readonly chattingMessageRepository: Repository<ChattingMessage>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async createRoom(token?: string): Promise<ChattingInfo> {
    try {
      /**
       * TODO : token을 받는다고 가정하고 작성
       */
      // let member: Member = new Member();
      // if (token) {
      //   const payload: JwtPayloadDto = this.jwtService.verify(token);
      //   const foundMember: Member | null = await this.membersService.findByEmail(payload.email, payload.providerId);
      //   if(!foundMember) {
      //     throw new BadRequestException();
      //   }
      //   member = foundMember;
      // }
      // else {
      //   member = await this.membersService.save(member);
      // }
      // const room: ChattingRoom = ChattingRoom.fromMember(member);
      const member: Member = new Member();
      const savedMember: Member = await this.membersRepository.save(member);
      const room: ChattingRoom = ChattingRoom.fromMember(savedMember);
      const savedRoom: ChattingRoom =
        await this.chattingRoomRepository.save(room);
      return { memeberId: savedMember.id, roomId: savedRoom.id };
    } catch (err: unknown) {
      throw err;
    }
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

  async findRoomsById(id: string): Promise<ChattingRoomDto[]> {
    try {
      const rooms: ChattingRoom[] = await this.chattingRoomRepository.findBy({
        id: id,
      });
      return rooms.map((room: ChattingRoom) =>
        ChattingRoomDto.fromEntity(room),
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async findMessagesById(id: string): Promise<ChattingMessageDto[]> {
    try {
      const messages: ChattingMessage[] =
        await this.chattingMessageRepository.findBy({ id: id });
      return messages.map((message: ChattingMessage) =>
        ChattingMessageDto.fromEntity(message),
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
}

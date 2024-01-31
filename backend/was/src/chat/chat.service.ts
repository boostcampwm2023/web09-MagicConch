import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { UserInfo } from 'src/common/types/socket';
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
  memberId: string;
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

  async createRoom(userInfo?: UserInfo): Promise<ChattingInfo> {
    return userInfo
      ? this.createRoomForMember(userInfo.email, userInfo.providerId)
      : this.createRoomForNonMember();
  }

  async createMessages(
    id: string,
    memberId: string,
    createMessageDtos: CreateChattingMessageDto[],
  ): Promise<void> {
    try {
      const room: ChattingRoom = await this.findRoom(id, memberId);
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

  async findRoomsByEmail(
    email: string,
    providerId: number,
  ): Promise<ChattingRoomDto[]> {
    try {
      const memberId: string = await this.findMemberIdByEmail(
        email,
        providerId,
      );
      const rooms = await this.chattingRoomRepository.findBy({
        participant: { id: memberId },
      });
      return rooms.map((room: ChattingRoom) =>
        ChattingRoomDto.fromEntity(room),
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async findMessagesById(
    id: string,
    email: string,
    providerId: number,
  ): Promise<ChattingMessageDto[]> {
    try {
      const memberId: string = await this.findMemberIdByEmail(
        email,
        providerId,
      );
      await this.findRoom(id, memberId);
      const messages: ChattingMessage[] =
        await this.chattingMessageRepository.findBy({ room: { id: id } });
      return messages.map((message: ChattingMessage) =>
        ChattingMessageDto.fromEntity(message),
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async updateRoom(
    id: string,
    email: string,
    providerId: number,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    try {
      const memberId: string = await this.findMemberIdByEmail(
        email,
        providerId,
      );
      await this.findRoom(id, memberId);
      await this.chattingRoomRepository.update(
        { id: id },
        { title: updateChattingRoomDto.title },
      );
    } catch (err: unknown) {
      throw err;
    }
  }

  async removeRoom(
    id: string,
    email: string,
    providerId: number,
  ): Promise<void> {
    try {
      const memberId: string = await this.findMemberIdByEmail(
        email,
        providerId,
      );
      await this.findRoom(id, memberId);
      await this.chattingRoomRepository.softDelete({ id: id });
    } catch (err: unknown) {
      throw err;
    }
  }

  private async createRoomForMember(
    email: string,
    providerId: number,
  ): Promise<ChattingInfo> {
    try {
      const member: Member | null = await this.membersRepository.findOneBy({
        email: email,
        providerId: providerId,
      });
      if (!member) {
        throw new BadRequestException();
      }
      const room: ChattingRoom = await this.chattingRoomRepository.save(
        ChattingRoom.fromMember(member),
      );
      return { memberId: member.id, roomId: room.id };
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
      return { memberId: member.id, roomId: room.id };
    } catch (err: unknown) {
      throw err;
    }
  }

  private async findRoom(id: string, memberId: string): Promise<ChattingRoom> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id: id });
    if (!room) {
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      throw new ForbiddenException(ERR_MSG.UPDATE_CHATTING_ROOM_FORBIDDEN);
    }
    return room;
  }

  private async findMemberIdByEmail(
    email: string,
    providerId: number,
  ): Promise<string> {
    const member: Member | null = await this.membersRepository.findOneBy({
      email: email,
      providerId: providerId,
    });
    if (!member) {
      throw new BadRequestException();
    }
    return member.id;
  }
}

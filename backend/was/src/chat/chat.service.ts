import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERR_MSG } from 'src/common/constants/errors';
import { UserInfo } from 'src/common/types/socket';
import { Member } from 'src/members/entities';
import { EntityManager } from 'typeorm';
import { ChattingInfo } from './chatting-info.interface';
import {
  ChattingMessageDto,
  ChattingRoomDto,
  ChattingRoomGroupDto,
  CreateChattingMessageDto,
  UpdateChattingRoomDto,
} from './dto';
import { ChattingMessage, ChattingRoom } from './entities';

@Injectable()
export class ChatService {
  constructor(private readonly entityManager: EntityManager) {}

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
    return this.entityManager.transaction(async (manager: EntityManager) => {
      try {
        const room: ChattingRoom = await this.findRoomById(
          manager,
          id,
          memberId,
        );
        const messages: ChattingMessage[] = createMessageDtos.map(
          (createMessageDto: CreateChattingMessageDto): ChattingMessage =>
            ChattingMessage.fromDto(createMessageDto, room),
        );
        await manager.insert(ChattingMessage, messages);
      } catch (err: unknown) {
        throw err;
      }
    });
  }

  async findRoomsByEmail(
    email: string,
    providerId: number,
  ): Promise<ChattingRoomGroupDto[]> {
    const rooms: ChattingRoom[] = await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          const member: Member = await this.findMemberByEmail(
            manager,
            email,
            providerId,
          );
          return await manager
            .createQueryBuilder(ChattingRoom, 'room')
            .select()
            .where('room.participantId = :memberId', { memberId: member.id })
            .orderBy('DATE(room.createdAt)', 'DESC')
            .getMany();
        } catch (err: unknown) {
          throw err;
        }
      },
    );
    return rooms.reduce((acc: ChattingRoomGroupDto[], curr: ChattingRoom) => {
      const roomDto: ChattingRoomDto = ChattingRoomDto.fromEntity(curr);
      const date: string = (curr?.createdAt ?? new Date()).toLocaleDateString(
        'ko-KR',
      );

      if (date === acc.at(-1)?.date) {
        acc.at(-1)?.rooms.push(roomDto);
        return acc;
      }
      acc.push(ChattingRoomGroupDto.makeGroup(date, roomDto));
      return acc;
    }, []);
  }

  async findMessagesById(
    id: string,
    email: string,
    providerId: number,
  ): Promise<ChattingMessageDto[]> {
    const messages: ChattingMessage[] = await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          const member: Member = await this.findMemberByEmail(
            manager,
            email,
            providerId,
          );
          await this.findRoomById(manager, id, member.id);
          return await manager.find(ChattingMessage, {
            where: { room: { id: id } },
            select: ['isHost', 'message'],
          });
        } catch (err: unknown) {
          throw err;
        }
      },
    );
    return messages.map(
      (message: ChattingMessage): ChattingMessageDto =>
        ChattingMessageDto.fromEntity(message),
    );
  }

  async updateRoom(
    id: string,
    email: string,
    providerId: number,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    return this.entityManager.transaction(async (manager: EntityManager) => {
      try {
        const member: Member = await this.findMemberByEmail(
          manager,
          email,
          providerId,
        );
        await this.findRoomById(manager, id, member.id);
        await manager.update(
          ChattingRoom,
          { id: id },
          { title: updateChattingRoomDto.title },
        );
      } catch (err: unknown) {
        throw err;
      }
    });
  }

  async removeRoom(
    id: string,
    email: string,
    providerId: number,
  ): Promise<void> {
    return this.entityManager.transaction(async (manager: EntityManager) => {
      try {
        const member: Member = await this.findMemberByEmail(
          manager,
          email,
          providerId,
        );
        await this.findRoomById(manager, id, member.id);
        await manager.softDelete(ChattingRoom, { id: id });
      } catch (err: unknown) {
        throw err;
      }
    });
  }

  private async createRoomForMember(
    email: string,
    providerId: number,
  ): Promise<ChattingInfo> {
    const { member, room } = await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          const member: Member = await this.findMemberByEmail(
            manager,
            email,
            providerId,
          );
          const room = await manager.save(
            ChattingRoom,
            ChattingRoom.fromMember(member),
          );
          return { member, room };
        } catch (err: unknown) {
          throw err;
        }
      },
    );
    return { memberId: member.id, roomId: room.id };
  }

  private async createRoomForNonMember(): Promise<ChattingInfo> {
    const { member, room } = await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          const member: Member = await manager.save(Member, new Member());
          const room = await manager.save(
            ChattingRoom,
            ChattingRoom.fromMember(member),
          );
          return { member, room };
        } catch (err: unknown) {
          throw err;
        }
      },
    );
    return { memberId: member.id, roomId: room.id };
  }

  private async findRoomById(
    manager: EntityManager,
    id: string,
    memberId: string,
  ): Promise<ChattingRoom> {
    try {
      const room: ChattingRoom | null = await manager.findOne(ChattingRoom, {
        where: { id: id },
        select: ['id', 'participant'],
      });
      if (!room) {
        throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
      }
      if (room.participant.id !== memberId) {
        throw new ForbiddenException(ERR_MSG.UPDATE_CHATTING_ROOM_FORBIDDEN);
      }
      return room;
    } catch (err: unknown) {
      throw err;
    }
  }

  private async findMemberByEmail(
    manager: EntityManager,
    email: string,
    providerId: number,
  ): Promise<Member> {
    try {
      const member: Member | null = await manager.findOne(Member, {
        where: {
          email: email,
          providerId: providerId,
        },
        select: ['id'],
      });
      if (!member) {
        throw new BadRequestException();
      }
      return member;
    } catch (err: unknown) {
      throw err;
    }
  }
}

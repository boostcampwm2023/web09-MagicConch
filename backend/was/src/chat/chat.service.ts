import { EntityManager } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserInfo } from '@common/types/socket';
import { CHAT_CODEMAP } from '@exceptions/codemap';
import { CustomException } from '@exceptions/custom-exception';
import { Member } from '@members/entities';
import { TarotResult } from '@tarot/entities';
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

  async createRoom(
    result: TarotResult,
    userInfo?: UserInfo,
  ): Promise<ChattingInfo> {
    return userInfo
      ? this.createRoomForMember(result, userInfo.email, userInfo.providerId)
      : this.createRoomForNonMember(result);
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
          (
            createMessageDto: CreateChattingMessageDto,
            idx: number,
          ): ChattingMessage =>
            ChattingMessage.fromDto(createMessageDto, room, idx),
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
            .select(['room.id', 'room.title'])
            .addSelect('room.createdAt', 'room_created_at')
            .where('room.participant_id = :memberId', { memberId: member.id })
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
          const { result }: ChattingRoom = await this.findRoomById(
            manager,
            id,
            member.id,
          );
          const messages: ChattingMessage[] = await manager
            .createQueryBuilder(ChattingMessage, 'message')
            .select('message.message', 'message_message')
            .addSelect('message.isHost', 'message_is_host')
            .where('message.room_id = :roomId', { roomId: id })
            .orderBy('DATE(message.order)')
            .getMany();
          const { tarotCard, tarotResult } = this.formatResultToMessage(result);
          messages.push(tarotCard, tarotResult);
          return messages;
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
    result: TarotResult,
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
          const room: ChattingRoom = await manager.save(
            ChattingRoom,
            ChattingRoom.fromInfo(result, member),
          );
          return { member, room };
        } catch (err: unknown) {
          throw err;
        }
      },
    );
    return { memberId: member.id, roomId: room.id };
  }

  private async createRoomForNonMember(
    result: TarotResult,
  ): Promise<ChattingInfo> {
    const { member, room } = await this.entityManager.transaction(
      async (manager: EntityManager) => {
        try {
          const member: Member = await manager.save(Member, new Member());
          const room: ChattingRoom = await manager.save(
            ChattingRoom,
            ChattingRoom.fromInfo(result, member),
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
        throw new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND);
      }
      if (room.participant.id !== memberId) {
        throw new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN);
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

  private formatResultToMessage(result: TarotResult): {
    tarotCard: ChattingMessage;
    tarotResult: ChattingMessage;
  } {
    return {
      tarotCard: ChattingMessage.formatResult(result.cardUrl),
      tarotResult: ChattingMessage.formatResult(result.message),
    };
  }
}

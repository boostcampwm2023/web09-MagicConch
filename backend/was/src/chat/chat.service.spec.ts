import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { ChatLog } from 'src/common/types/chatbot';
import { UserInfo } from 'src/common/types/socket';
import { Member } from 'src/members/entities';
import { EntityManager, Repository } from 'typeorm';
import { ChatRepository } from './chat.repository';
import { ChatService, ChattingInfo } from './chat.service';
import {
  ChattingMessageDto,
  ChattingRoomDto,
  CreateChattingMessageDto,
  UpdateChattingRoomDto,
} from './dto';
import { ChattingMessage, ChattingRoom } from './entities';

describe('ChatService', () => {
  let chatService: ChatService;
  let chatRepository: ChatRepository;
  let chattingRoomRepository: Repository<ChattingRoom>;
  let chattingMessageRepository: Repository<ChattingMessage>;
  let membersRepository: Repository<Member>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        ChatRepository,
        {
          provide: getRepositoryToken(ChattingRoom),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ChattingMessage),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useClass: EntityManager,
        },
      ],
    }).compile();

    chatService = moduleRef.get<ChatService>(ChatService);
    chatRepository = moduleRef.get<ChatRepository>(ChatRepository);
    chattingRoomRepository = moduleRef.get<Repository<ChattingRoom>>(
      getRepositoryToken(ChattingRoom),
    );
    chattingMessageRepository = moduleRef.get<Repository<ChattingMessage>>(
      getRepositoryToken(ChattingMessage),
    );
    membersRepository = moduleRef.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('createRoom', () => {
    describe('사용자는 채팅방을 생성할 수 있다.', () => {
      it('로그인 하지 않은 사용자는 채팅방을 생성할 수 있다.', async () => {
        [
          {
            memberId: '12345678-1234-5678-1234-567812345670',
            roomId: '12345678-1234-5678-1234-567812345672',
          },
          {
            memberId: '12345678-1234-5678-1234-567812345671',
            roomId: '12345678-1234-5678-1234-567812345673',
          },
        ].forEach(async ({ memberId, roomId }) => {
          const member: Member = { id: memberId };
          const room: ChattingRoom = {
            id: roomId,
            participant: member,
          };

          const saveMemberMock = jest
            .spyOn(membersRepository, 'save')
            .mockResolvedValueOnce(member);
          const saveRoomMock = jest
            .spyOn(chattingRoomRepository, 'save')
            .mockResolvedValueOnce(room);

          await expect(chatService.createRoom()).resolves.not.toThrow();
          expect(saveMemberMock).toHaveBeenCalled();
          expect(saveRoomMock).toHaveBeenCalledWith({ participant: member });
        });
      });

      it('로그인한 사용자는 채팅방을 생성할 수 있다.', async () => {
        [
          {
            memberId: '12345678-1234-5678-1234-567812345670',
            email: 'tarotmilktea@kakao.com',
            providerId: PROVIDER_ID.KAKAO,
            roomId: '12345678-1234-5678-1234-567812345672',
          },
          {
            memberId: '12345678-1234-5678-1234-567812345671',
            email: 'tarotmilktea2@kakao.com',
            providerId: PROVIDER_ID.KAKAO,
            roomId: '12345678-1234-5678-1234-567812345673',
          },
        ].forEach(async ({ memberId, email, providerId, roomId }) => {
          const member: Member = {
            id: memberId,
            email: email,
            providerId: providerId,
          };
          const room: ChattingRoom = {
            id: roomId,
            participant: member,
          };
          const userInfo: UserInfo = {
            email: email ?? '',
            providerId: providerId ?? 0,
          };

          const findMemberMock = jest
            .spyOn(membersRepository, 'findOne')
            .mockResolvedValueOnce(member);
          const saveRoomMock = jest
            .spyOn(chattingRoomRepository, 'save')
            .mockResolvedValueOnce(room);

          const expectation: ChattingInfo =
            await chatService.createRoom(userInfo);
          expect(expectation).toEqual({
            memberId: memberId,
            roomId: roomId,
          });
          expect(findMemberMock).toHaveBeenCalledWith({
            where: {
              email: userInfo.email,
              providerId: userInfo.providerId,
            },
            select: ['id'],
          });
          expect(saveRoomMock).toHaveBeenCalledWith({ participant: member });
        });
      });
    });
  });

  describe('createMessages', () => {
    it('사용자는 특정 채팅방에 메시지를 생성할 수 있다.', () => {
      [
        {
          roomId: '12345678-1234-5678-1234-567812345670',
          memberId: '12345678-1234-5678-1234-567812345671',
          messages: {
            id: '12345678-1234-5678-1234-567812345672',
            role: 'assistant',
            message: '어떤 내용을 상담하고 싶어?',
          },
        },
      ].forEach(async ({ roomId, memberId, messages }) => {
        const member: Member = {
          id: memberId,
        };
        const room: ChattingRoom = {
          id: roomId,
          participant: member,
        };
        const chatLog: ChatLog = {
          isHost: messages.role === 'assistant',
          message: messages.message,
        };
        const createMessageDto: CreateChattingMessageDto =
          CreateChattingMessageDto.fromChatLog(room.id, chatLog);

        const saveMessagesMock = jest
          .spyOn(chatRepository, 'saveMessages')
          .mockResolvedValueOnce();
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.createMessages(roomId, memberId, [createMessageDto]),
        ).resolves.not.toThrow();
        expect(saveMessagesMock).toHaveBeenCalledWith(room, [createMessageDto]);
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: room.id },
          select: ['id', 'participant'],
        });
      });
    });

    it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
      [
        {
          roomId: '12345678-1234-5678-1234-567812345670',
          memberId: '12345678-1234-5678-1234-567812345672',
        },
        {
          roomId: '12345678-1234-5678-1234-567812345671',
          memberId: '12345678-1234-5678-1234-567812345673',
        },
      ].forEach(async ({ roomId, memberId }) => {
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.createMessages(roomId, memberId, []),
        ).rejects.toThrow(NotFoundException);
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: roomId },
          select: ['id', 'participant'],
        });
      });
    });
  });

  describe('findRoomsByEmail', () => {
    it('사용자는 자신의 채팅방 목록을 조회할 수 있다.', async () => {
      const member: Member = {
        id: '12345678-1234-5678-1234-567812345670',
        email: 'tarotmilktea@kakao.com',
        providerId: PROVIDER_ID.KAKAO,
      };
      const rooms: ChattingRoom[] = [
        {
          id: '12345678-1234-5678-1234-567812345671',
          title: '오늘의 운세 채팅방',
          participant: member,
        },
        {
          id: '12345678-1234-5678-1234-567812345672',
          title: '내일의 운세 채팅방',
          participant: member,
        },
      ];

      const findMemberMock = jest
        .spyOn(membersRepository, 'findOne')
        .mockResolvedValueOnce(member);
      const findRoomMock = jest
        .spyOn(chattingRoomRepository, 'find')
        .mockResolvedValueOnce(rooms);

      const expectation: ChattingRoomDto[] = await chatService.findRoomsByEmail(
        member.email ?? '',
        member.providerId ?? 0,
      );
      expect(expectation).toEqual(
        rooms.map((room: ChattingRoom) => ({
          id: room.id,
          title: room.title,
        })),
      );
      expect(findMemberMock).toHaveBeenCalledWith({
        where: {
          email: member.email,
          providerId: member.providerId,
        },
        select: ['id'],
      });
      expect(findRoomMock).toHaveBeenCalledWith({
        where: {
          participant: { id: member.id },
        },
        select: ['id', 'title'],
      });
    });
  });

  describe('findMessagesById', () => {
    let member: Member;
    let room: ChattingRoom;
    let messages: ChattingMessage[];

    beforeEach(() => {
      member = {
        id: '12345678-1234-5678-1234-567812345670',
        email: 'tarotmilktea@kakao.com',
        providerId: PROVIDER_ID.KAKAO,
      };

      room = {
        id: '12345678-1234-5678-1234-567812345671',
        participant: member,
      };

      messages = [
        {
          id: '12345678-1234-5678-1234-567812345672',
          isHost: true,
          message: '어떤 고민이 있어?',
          room: room,
        },
        {
          id: '12345678-1234-5678-1234-567812345673',
          isHost: false,
          message: '오늘 운세를 알고 싶어',
          room: room,
        },
      ];
    });

    it('해당 아이디의 채팅방에 오고 간 채팅 메시지를 조회할 수 있다.', async () => {
      const findMemberMock = jest
        .spyOn(membersRepository, 'findOne')
        .mockResolvedValueOnce(member);
      const findRoomMock = jest
        .spyOn(chattingRoomRepository, 'findOne')
        .mockResolvedValueOnce(room);
      const findMessagesMock = jest
        .spyOn(chattingMessageRepository, 'find')
        .mockResolvedValueOnce(messages);

      const expectation: ChattingMessageDto[] =
        await chatService.findMessagesById(
          room.id,
          member.email ?? '',
          member.providerId ?? 0,
        );
      expect(expectation).toEqual(
        messages.map((message: ChattingMessage) =>
          ChattingMessageDto.fromEntity(message),
        ),
      );
      expect(findMemberMock).toHaveBeenCalledWith({
        where: {
          email: member.email,
          providerId: member.providerId,
        },
        select: ['id'],
      });
      expect(findRoomMock).toHaveBeenCalledWith({
        where: { id: room.id },
        select: ['id', 'participant'],
      });
      expect(findMessagesMock).toHaveBeenCalledWith({
        where: {
          room: { id: room.id },
        },
        select: ['isHost', 'message'],
      });
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-1234-0000-1234-567812345679';

        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(member);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.findMessagesById(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: member.email,
            providerId: member.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: wrongRoomId },
          select: ['id', 'participant'],
        });
      });

      it('해당 아이디의 채팅방을 조회할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(forbiddenMember);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.findMessagesById(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: forbiddenMember.email,
            providerId: forbiddenMember.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: room.id },
          select: ['id', 'participant'],
        });
      });
    });
  });

  describe('updateRoom', () => {
    let member: Member;
    let room: ChattingRoom;
    let updateRoomDto: UpdateChattingRoomDto;

    beforeEach(() => {
      member = {
        id: '12345678-1234-5678-1234-567812345670',
        email: 'tarotmilktea@kakao.com',
        providerId: PROVIDER_ID.KAKAO,
      };

      room = {
        id: '12345678-1234-5678-1234-567812345671',
        participant: member,
      };

      updateRoomDto = {
        title: '수정된 채팅방 제목',
      };
    });

    it('해당 아이디의 채팅방 제목을 수정할 수 있다.', async () => {
      const findMemberMock = jest
        .spyOn(membersRepository, 'findOne')
        .mockResolvedValueOnce(member);
      const findRoomMock = jest
        .spyOn(chattingRoomRepository, 'findOne')
        .mockResolvedValueOnce(room);
      const updateRoomMock = jest
        .spyOn(chattingRoomRepository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as any);

      await expect(
        chatService.updateRoom(
          room.id,
          member.email ?? '',
          member.providerId ?? 0,
          updateRoomDto,
        ),
      ).resolves.not.toThrow();
      expect(findMemberMock).toHaveBeenCalledWith({
        where: {
          email: member.email,
          providerId: member.providerId,
        },
        select: ['id'],
      });
      expect(findRoomMock).toHaveBeenCalledWith({
        where: { id: room.id },
        select: ['id', 'participant'],
      });
      expect(updateRoomMock).toHaveBeenCalledWith(
        { id: room.id },
        { title: updateRoomDto.title },
      );
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';
        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(member);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.updateRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: member.email,
            providerId: member.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: wrongRoomId },
          select: ['id', 'participant'],
        });
      });

      it('해당 아이디의 채팅방을 수정할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(forbiddenMember);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.updateRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: forbiddenMember.email,
            providerId: forbiddenMember.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: room.id },
          select: ['id', 'participant'],
        });
      });
    });
  });

  describe('removeRoom', () => {
    let member: Member;
    let room: ChattingRoom;

    beforeEach(() => {
      member = {
        id: '12345678-1234-5678-1234-567812345670',
        email: 'tarotmilktea@kakao.com',
        providerId: PROVIDER_ID.KAKAO,
      };

      room = {
        id: '12345678-1234-5678-1234-567812345671',
        participant: member,
      };
    });

    it('해당 아이디의 채팅방을 삭제할 수 있다.', async () => {
      const findMemberMock = jest
        .spyOn(membersRepository, 'findOne')
        .mockResolvedValueOnce(member);
      const findRoomMock = jest
        .spyOn(chattingRoomRepository, 'findOne')
        .mockResolvedValueOnce(room);
      const deleteRoomMock = jest
        .spyOn(chattingRoomRepository, 'softDelete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      await expect(
        chatService.removeRoom(
          room.id,
          member.email ?? '',
          member.providerId ?? 0,
        ),
      ).resolves.not.toThrow();
      expect(findMemberMock).toHaveBeenCalledWith({
        where: {
          email: member.email,
          providerId: member.providerId,
        },
        select: ['id'],
      });
      expect(findRoomMock).toHaveBeenCalledWith({
        where: { id: room.id },
        select: ['id', 'participant'],
      });
      expect(deleteRoomMock).toHaveBeenCalledWith({ id: room.id });
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아아디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';

        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(member);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.removeRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: member.email,
            providerId: member.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: wrongRoomId },
          select: ['id', 'participant'],
        });
      });

      it('해당 아이디의 채팅방을 삭제할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const findMemberMock = jest
          .spyOn(membersRepository, 'findOne')
          .mockResolvedValueOnce(forbiddenMember);
        const findRoomMock = jest
          .spyOn(chattingRoomRepository, 'findOne')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.removeRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(findMemberMock).toHaveBeenCalledWith({
          where: {
            email: forbiddenMember.email,
            providerId: forbiddenMember.providerId,
          },
          select: ['id'],
        });
        expect(findRoomMock).toHaveBeenCalledWith({
          where: { id: room.id },
          select: ['id', 'participant'],
        });
      });
    });
  });
});

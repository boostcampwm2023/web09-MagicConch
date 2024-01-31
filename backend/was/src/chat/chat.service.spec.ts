import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { ChatLog } from 'src/common/types/chatbot';
import { UserInfo } from 'src/common/types/socket';
import { Member } from 'src/members/entities';
import { Repository } from 'typeorm';
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
  let chattingRoomRepository: Repository<ChattingRoom>;
  let chattingMessageRepository: Repository<ChattingMessage>;
  let membersRepository: Repository<Member>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
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
      ],
    }).compile();

    chatService = moduleRef.get<ChatService>(ChatService);
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
    describe('성공', () => {
      it('채팅방을 생성한다 (로그인 하지 않은 사용자)', async () => {
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

          const memberSaveMock = jest
            .spyOn(membersRepository, 'save')
            .mockResolvedValueOnce(member);
          const roomSaveMock = jest
            .spyOn(chattingRoomRepository, 'save')
            .mockResolvedValueOnce(room);

          await expect(chatService.createRoom()).resolves.not.toThrow();
          expect(memberSaveMock).toHaveBeenCalled();
          expect(roomSaveMock).toHaveBeenCalledWith({ participant: member });
        });
      });

      it('채팅방을 생성한다 (로그인한 사용자)', async () => {
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

          const memberFindOneByMock = jest
            .spyOn(membersRepository, 'findOneBy')
            .mockResolvedValueOnce(member);
          const roomSaveMock = jest
            .spyOn(chattingRoomRepository, 'save')
            .mockResolvedValueOnce(room);

          const expectation: ChattingInfo =
            await chatService.createRoom(userInfo);
          expect(expectation).toEqual({
            memberId: memberId,
            roomId: roomId,
          });
          expect(memberFindOneByMock).toHaveBeenCalledWith({
            email: userInfo.email,
            providerId: userInfo.providerId,
          });
          expect(roomSaveMock).toHaveBeenCalledWith({ participant: member });
        });
      });
    });
  });

  describe('createMessages', () => {
    describe('성공', () => {
      it('해당 PK의 채팅방에 채팅 메시지를 생성한다', async () => {
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
          const message: ChattingMessage = ChattingMessage.fromDto(
            createMessageDto,
            room,
          );

          const roomFindOneByMock = jest
            .spyOn(chattingRoomRepository, 'findOneBy')
            .mockResolvedValueOnce(room);
          const messageSaveMock = jest
            .spyOn(chattingMessageRepository, 'save')
            .mockResolvedValueOnce(message);

          await expect(
            chatService.createMessages(roomId, memberId, [createMessageDto]),
          ).resolves.not.toThrow();
          expect(roomFindOneByMock).toHaveBeenCalledWith({
            id: room.id,
          });
          expect(messageSaveMock).toHaveBeenCalledWith(message);
        });
      });
    });

    describe('실패', () => {
      it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
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
          const findOneByMock = jest
            .spyOn(chattingRoomRepository, 'findOneBy')
            .mockResolvedValueOnce(null);

          await expect(
            chatService.createMessages(roomId, memberId, []),
          ).rejects.toThrow(NotFoundException);
          expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
        });
      });
    });
  });

  describe('findRoomsByEmail', () => {
    describe('성공', () => {
      it('해당 PK의 채팅방을 조회한다', async () => {
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

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindByMock = jest
          .spyOn(chattingRoomRepository, 'findBy')
          .mockResolvedValueOnce(rooms);

        const expectation: ChattingRoomDto[] =
          await chatService.findRoomsByEmail(
            member.email ?? '',
            member.providerId ?? 0,
          );
        expect(expectation).toEqual(
          rooms.map((room: ChattingRoom) => ({
            id: room.id,
            title: room.title,
          })),
        );
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindByMock).toHaveBeenCalledWith({
          participant: { id: member.id },
        });
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

    describe('성공', () => {
      it('해당 PK의 채팅방에 오고 간 채팅 메시지를 조회한다', async () => {
        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);
        const messageFindByMock = jest
          .spyOn(chattingMessageRepository, 'findBy')
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
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
        expect(messageFindByMock).toHaveBeenCalledWith({
          room: { id: room.id },
        });
      });
    });

    describe('실패', () => {
      it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
        const wrongRoomId: string = '12345678-1234-0000-1234-567812345679';

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.findMessagesById(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: wrongRoomId });
      });

      it('해당 PK의 채팅방을 조회할 수 있는 권한이 없어 ForbiddenException을 반환한다', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(forbiddenMember);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.findMessagesById(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: forbiddenMember.email,
          providerId: forbiddenMember.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
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

    describe('성공', () => {
      it('해당 PK의 채팅방 제목을 수정한다', async () => {
        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);
        const roomUpdateMock = jest
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
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
        expect(roomUpdateMock).toHaveBeenCalledWith(
          { id: room.id },
          { title: updateRoomDto.title },
        );
      });
    });

    describe('실패', () => {
      it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';
        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.updateRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: wrongRoomId });
      });

      it('해당 PK의 채팅방을 수정할 수 있는 권한이 없어 ForbiddenException을 반환한다', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(forbiddenMember);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.updateRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: forbiddenMember.email,
          providerId: forbiddenMember.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
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

    describe('성공', () => {
      it('해당 PK의 채팅방을 삭제한다', async () => {
        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);
        const roomSoftDeleteMock = jest
          .spyOn(chattingRoomRepository, 'softDelete')
          .mockResolvedValueOnce({ affected: 1 } as any);

        await expect(
          chatService.removeRoom(
            room.id,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).resolves.not.toThrow();
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
        expect(roomSoftDeleteMock).toHaveBeenCalledWith({ id: room.id });
      });
    });

    describe('실패', () => {
      it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(member);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(null);

        await expect(
          chatService.removeRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(NotFoundException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: member.email,
          providerId: member.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: wrongRoomId });
      });

      it('해당 PK의 채팅방을 삭제할 수 있는 권한이 없어 ForbiddenException을 반환한다', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: PROVIDER_ID.KAKAO,
        };

        const memberFindOneByMock = jest
          .spyOn(membersRepository, 'findOneBy')
          .mockResolvedValueOnce(forbiddenMember);
        const roomFindOneByMock = jest
          .spyOn(chattingRoomRepository, 'findOneBy')
          .mockResolvedValueOnce(room);

        await expect(
          chatService.removeRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(ForbiddenException);
        expect(memberFindOneByMock).toHaveBeenCalledWith({
          email: forbiddenMember.email,
          providerId: forbiddenMember.providerId,
        });
        expect(roomFindOneByMock).toHaveBeenCalledWith({ id: room.id });
      });
    });
  });
});

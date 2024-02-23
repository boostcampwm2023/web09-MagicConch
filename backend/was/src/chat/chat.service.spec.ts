import { Test, TestingModule } from '@nestjs/testing';
import { ProviderIdEnum } from 'src/common/constants/etc';
import { ChatLog } from 'src/common/types/chatbot';
import { UserInfo } from 'src/common/types/socket';
import { CustomException } from 'src/exceptions';
import { CHAT_CODEMAP } from 'src/exceptions/codemap';
import { Member } from 'src/members/entities';
import { EntityManager } from 'typeorm';
import { ChatService } from './chat.service';
import { ChattingInfo } from './chatting-info.interface';
import {
  ChattingMessageDto,
  ChattingRoomGroupDto,
  CreateChattingMessageDto,
  UpdateChattingRoomDto,
} from './dto';
import { ChattingMessage, ChattingRoom } from './entities';

const JAN_15: string = '2024-01-15';
const JAN_26: string = '2024-01-26';

describe('ChatService', () => {
  let chatService: ChatService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: EntityManager,
          useClass: EntityManager,
        },
      ],
    }).compile();

    chatService = moduleRef.get<ChatService>(ChatService);
    entityManager = moduleRef.get<EntityManager>(EntityManager);
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
        const testData = [
          {
            memberId: '12345678-1234-5678-1234-567812345670',
            roomId: '12345678-1234-5678-1234-567812345672',
          },
          {
            memberId: '12345678-1234-5678-1234-567812345671',
            roomId: '12345678-1234-5678-1234-567812345673',
          },
        ];
        for (const { memberId, roomId } of testData) {
          const member: Member = { id: memberId };
          const room: ChattingRoom = {
            id: roomId,
            participant: member,
          };

          const transactionMock = jest
            .spyOn(entityManager, 'transaction')
            .mockImplementation(
              async () => await Promise.resolve({ member, room }),
            );

          await expect(chatService.createRoom()).resolves.toEqual({
            memberId: member.id,
            roomId: room.id,
          });
          expect(transactionMock).toHaveBeenCalled();
        }
      });

      it('로그인한 사용자는 채팅방을 생성할 수 있다.', async () => {
        const testData = [
          {
            memberId: '12345678-1234-5678-1234-567812345670',
            email: 'tarotmilktea@kakao.com',
            providerId: ProviderIdEnum.KAKAO,
            roomId: '12345678-1234-5678-1234-567812345672',
          },
          {
            memberId: '12345678-1234-5678-1234-567812345671',
            email: 'tarotmilktea2@kakao.com',
            providerId: ProviderIdEnum.KAKAO,
            roomId: '12345678-1234-5678-1234-567812345673',
          },
        ];
        for (const { memberId, email, providerId, roomId } of testData) {
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

          const transactionMock = jest
            .spyOn(entityManager, 'transaction')
            .mockImplementation(
              async () => await Promise.resolve({ member, room }),
            );

          const expectation: ChattingInfo =
            await chatService.createRoom(userInfo);
          expect(expectation).toEqual({
            memberId: memberId,
            roomId: roomId,
          });
          expect(transactionMock).toHaveBeenCalled();
        }
      });
    });
  });

  describe('createMessages', () => {
    it('사용자는 특정 채팅방에 메시지를 생성할 수 있다.', async () => {
      const testData = [
        {
          roomId: '12345678-1234-5678-1234-567812345670',
          memberId: '12345678-1234-5678-1234-567812345671',
          messages: {
            id: '12345678-1234-5678-1234-567812345672',
            role: 'assistant',
            message: '어떤 내용을 상담하고 싶어?',
          },
        },
      ];
      for (const { roomId, memberId, messages } of testData) {
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

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(async () => await Promise.resolve());

        await expect(
          chatService.createMessages(roomId, memberId, [createMessageDto]),
        ).resolves.not.toThrow();
        expect(transactionMock).toHaveBeenCalled();
      }
    });

    it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
      const testData = [
        {
          roomId: '12345678-1234-5678-1234-567812345670',
          memberId: '12345678-1234-5678-1234-567812345672',
        },
        {
          roomId: '12345678-1234-5678-1234-567812345671',
          memberId: '12345678-1234-5678-1234-567812345673',
        },
      ];
      for (const { roomId, memberId } of testData) {
        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND),
              ),
          );

        await expect(
          chatService.createMessages(roomId, memberId, []),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND));
        expect(transactionMock).toHaveBeenCalled();
      }
    });
  });

  describe('findRoomsByEmail', () => {
    it('사용자는 자신의 채팅방 목록을 생성일자 내림차순으로 조회할 수 있다.', async () => {
      const jan15 = new Date(JAN_15);
      const jan26 = new Date(JAN_26);

      const member: Member = {
        id: '12345678-1234-5678-1234-567812345670',
        email: 'tarotmilktea@kakao.com',
        providerId: ProviderIdEnum.KAKAO,
      };
      const rooms: ChattingRoom[] = [
        {
          id: '12345678-1234-5678-1234-567812345672',
          title: '내일의 운세 채팅방',
          participant: member,
          createdAt: jan26,
        },
        {
          id: '12345678-1234-5678-1234-567812345671',
          title: '오늘의 운세 채팅방',
          participant: member,
          createdAt: jan15,
        },
      ];

      const roomGroups: ChattingRoomGroupDto[] = [
        {
          date: jan26.toLocaleDateString('ko-KR'),
          rooms: [
            {
              id: rooms.at(0)?.id ?? '',
              title: rooms.at(0)?.title,
              createdAt: (
                rooms.at(0)?.createdAt ?? new Date()
              ).toLocaleDateString('ko-KR'),
            },
          ],
        },
        {
          date: jan15.toLocaleDateString('ko-KR'),
          rooms: [
            {
              id: rooms.at(1)?.id ?? '',
              title: rooms.at(1)?.title,
              createdAt: (
                rooms.at(1)?.createdAt ?? new Date()
              ).toLocaleDateString('ko-KR'),
            },
          ],
        },
      ];

      const transactionMock = jest
        .spyOn(entityManager, 'transaction')
        .mockImplementation(async () => await Promise.resolve(rooms));

      const expectation: ChattingRoomGroupDto[] =
        await chatService.findRoomsByEmail(
          member.email ?? '',
          member.providerId ?? 0,
        );
      expect(expectation).toEqual(roomGroups);
      expect(transactionMock).toHaveBeenCalled();
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
        providerId: ProviderIdEnum.KAKAO,
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
          order: 0,
          room: room,
        },
        {
          id: '12345678-1234-5678-1234-567812345673',
          isHost: false,
          message: '오늘 운세를 알고 싶어',
          order: 1,
          room: room,
        },
      ];
    });

    it('해당 아이디의 채팅방에 오고 간 채팅 메시지를 조회할 수 있다.', async () => {
      const transactionMock = jest
        .spyOn(entityManager, 'transaction')
        .mockImplementation(async () => await Promise.resolve(messages));

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
      expect(transactionMock).toHaveBeenCalled();
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-1234-0000-1234-567812345679';

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND),
              ),
          );

        await expect(
          chatService.findMessagesById(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND));
        expect(transactionMock).toHaveBeenCalled();
      });

      it('해당 아이디의 채팅방을 조회할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: ProviderIdEnum.KAKAO,
        };

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN),
              ),
          );

        await expect(
          chatService.findMessagesById(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN));
        expect(transactionMock).toHaveBeenCalled();
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
        providerId: ProviderIdEnum.KAKAO,
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
      const transactionMock = jest
        .spyOn(entityManager, 'transaction')
        .mockImplementation(async () => await Promise.resolve());

      await expect(
        chatService.updateRoom(
          room.id,
          member.email ?? '',
          member.providerId ?? 0,
          updateRoomDto,
        ),
      ).resolves.not.toThrow();
      expect(transactionMock).toHaveBeenCalled();
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아이디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND),
              ),
          );

        await expect(
          chatService.updateRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND));
        expect(transactionMock).toHaveBeenCalled();
      });

      it('해당 아이디의 채팅방을 수정할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: ProviderIdEnum.KAKAO,
        };

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN),
              ),
          );

        await expect(
          chatService.updateRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
            updateRoomDto,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN));
        expect(transactionMock).toHaveBeenCalled();
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
        providerId: ProviderIdEnum.KAKAO,
      };

      room = {
        id: '12345678-1234-5678-1234-567812345671',
        participant: member,
      };
    });

    it('해당 아이디의 채팅방을 삭제할 수 있다.', async () => {
      const transactionMock = jest
        .spyOn(entityManager, 'transaction')
        .mockImplementation(async () => await Promise.resolve());

      await expect(
        chatService.removeRoom(
          room.id,
          member.email ?? '',
          member.providerId ?? 0,
        ),
      ).resolves.not.toThrow();
      expect(transactionMock).toHaveBeenCalled();
    });

    describe('잘못된 파라미터를 받으면 에러를 던진다.', () => {
      it('해당 아아디의 채팅방이 존재하지 않아 NotFoundException을 반환한다.', async () => {
        const wrongRoomId: string = '12345678-0000-0000-1234-567812345678';

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND),
              ),
          );

        await expect(
          chatService.removeRoom(
            wrongRoomId,
            member.email ?? '',
            member.providerId ?? 0,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_NOT_FOUND));
        expect(transactionMock).toHaveBeenCalled();
      });

      it('해당 아이디의 채팅방을 삭제할 수 있는 권한이 없어 ForbiddenException을 반환한다.', async () => {
        const forbiddenMember: Member = {
          id: '12345678-0000-0000-1234-567812345678',
          email: 'tarotmilktea2@kakao.com',
          providerId: ProviderIdEnum.KAKAO,
        };

        const transactionMock = jest
          .spyOn(entityManager, 'transaction')
          .mockImplementation(
            async () =>
              await Promise.reject(
                new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN),
              ),
          );

        await expect(
          chatService.removeRoom(
            room.id,
            forbiddenMember.email ?? '',
            forbiddenMember.providerId ?? 0,
          ),
        ).rejects.toThrow(new CustomException(CHAT_CODEMAP.ROOM_FORBIDDEN));
        expect(transactionMock).toHaveBeenCalled();
      });
    });
  });
});

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from 'src/events/type';
import { Member } from 'src/members/entities/member.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from './chat.service';
import { CreateChattingMessageDto } from './dto/create-chatting-message.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

describe('ChatService', () => {
  let service: ChatService;
  let chattingRoomRepository: Repository<ChattingRoom>;
  let chattingMessageRepository: Repository<ChattingMessage>;
  let membersRepository: Repository<Member>;

  /**
   * mock data
   */
  const memberId: string = uuidv4();
  const roomId: string = uuidv4();
  const messageId: string = uuidv4();

  const nonMemberId: string = uuidv4();
  const diffMemberId: string = uuidv4();
  const nonRoomId: string = uuidv4();

  const memberMock: Member = new Member();
  memberMock.id = memberId;

  const roomMock: ChattingRoom = new ChattingRoom();
  roomMock.id = roomId;
  roomMock.title = 'chatting room title';
  roomMock.participant = memberMock;

  const message: Message = {
    roomId: messageId,
    chat: {
      role: 'user',
      content: 'chatting message content',
    },
  };

  const messageMock: ChattingMessage = new ChattingMessage();
  messageMock.id = messageId;
  messageMock.isHost = message.chat.role === 'assistant';
  messageMock.message = message.chat.content;
  messageMock.room = roomMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ChatService>(ChatService);
    chattingRoomRepository = module.get<Repository<ChattingRoom>>(
      getRepositoryToken(ChattingRoom),
    );
    chattingMessageRepository = module.get<Repository<ChattingMessage>>(
      getRepositoryToken(ChattingMessage),
    );
    membersRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoom', () => {
    it('should create a room', async () => {
      // const findOneByMock = jest
      //   .spyOn(membersRepository, 'findOneBy')
      //   .mockResolvedValueOnce(memberMock);
      const saveMemberMock = jest
        .spyOn(membersRepository, 'save')
        .mockResolvedValueOnce(memberMock);

      const saveMock = jest
        .spyOn(chattingRoomRepository, 'save')
        .mockResolvedValueOnce(roomMock);

      await service.createRoom(memberId);

      // expect(findOneByMock).toHaveBeenCalledWith({ id: memberId });
      expect(saveMemberMock).toHaveBeenCalledWith({});
      expect(saveMock).toHaveBeenCalledWith({ participant: memberMock });
    });

    // it('should throw NotFoundException when member is not found', async () => {
    //   const findOneByMock = jest
    //     .spyOn(membersRepository, 'findOneBy')
    //     .mockResolvedValueOnce(null);

    //   await expect(service.createRoom(nonMemberId)).rejects.toThrow(
    //     NotFoundException,
    //   );

    //   expect(findOneByMock).toHaveBeenCalledWith({ id: nonMemberId });
    // });
  });

  describe('createMessage', () => {
    it('should create messages', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const saveMock = jest
        .spyOn(chattingMessageRepository, 'save')
        .mockResolvedValueOnce(messageMock);

      const createChattingMessageDto: CreateChattingMessageDto =
        CreateChattingMessageDto.fromMessage(message);

      await service.createMessage(roomId, [createChattingMessageDto]);

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
      expect(saveMock).toHaveBeenCalledWith({
        room: expect.any(ChattingRoom),
        isHost: createChattingMessageDto.isHost,
        message: createChattingMessageDto.message,
      });
    });

    it('should throw NotFoundException when room is not found', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(service.createMessage(nonRoomId, [])).rejects.toThrow(
        NotFoundException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({ id: nonRoomId });
    });
  });

  describe('findRoomsById', () => {
    it('should find rooms', async () => {
      const roomMocks: ChattingRoom[] = [roomMock];

      const findByMock = jest
        .spyOn(chattingRoomRepository, 'findBy')
        .mockResolvedValueOnce(roomMocks);

      const result = await service.findRoomsById(roomId);

      expect(result).toEqual(
        roomMocks.map((room) =>
          expect.objectContaining({ id: room.id, title: room.title }),
        ),
      );

      expect(findByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('findMessagesById', () => {
    it('should find messages', async () => {
      const messageMocks: ChattingMessage[] = [messageMock];

      const findByMock = jest
        .spyOn(chattingMessageRepository, 'findBy')
        .mockResolvedValueOnce(messageMocks);

      const result = await service.findMessagesById(roomId);

      expect(result).toEqual(
        messageMocks.map((message) =>
          expect.objectContaining({
            id: message.id,
            isHost: message.isHost,
            message: message.message,
          }),
        ),
      );

      expect(findByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('updateRoom', () => {
    const updateChattingRoomDto = new UpdateChattingRoomDto();
    updateChattingRoomDto.title = 'revised title';

    it('should update specific room', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const updateMock = jest.spyOn(chattingRoomRepository, 'update');
      updateMock.mockResolvedValueOnce({ affected: 1 } as any);

      await expect(
        service.updateRoom(roomId, memberId, updateChattingRoomDto),
      ).resolves.not.toThrow();

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });

      expect(updateMock).toHaveBeenCalledWith(
        { id: roomId },
        { title: updateChattingRoomDto.title },
      );
    });

    it('should throw NotFoundException when room is not found', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(
        service.updateRoom(roomId, memberId, updateChattingRoomDto),
      ).rejects.toThrow(NotFoundException);

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('should throw ForbiddenException when memberId does not match', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      await expect(
        service.updateRoom(roomId, diffMemberId, updateChattingRoomDto),
      ).rejects.toThrow(ForbiddenException);

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('removeRoom', () => {
    it('should remove specific room', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const softDeleteMock = jest.spyOn(chattingRoomRepository, 'softDelete');
      softDeleteMock.mockResolvedValueOnce({ affected: 1 } as any);

      await expect(service.removeRoom(roomId, memberId)).resolves.not.toThrow();

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });

      expect(softDeleteMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('should throw NotFoundException when room is not found', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(service.removeRoom(roomId, memberId)).rejects.toThrow(
        NotFoundException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('should throw ForbiddenException when memberId does not match', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      await expect(service.removeRoom(roomId, diffMemberId)).rejects.toThrow(
        ForbiddenException,
      );

      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });
});

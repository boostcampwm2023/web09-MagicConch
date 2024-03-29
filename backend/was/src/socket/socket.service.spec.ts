import {
  TarotResultMock,
  aiMessageMock,
  chatServiceMock,
  chatbotServiceMock,
  clientMock,
  humanMessageMock,
  loggerServiceMock,
  tarotIdxMock,
  tarotServiceMock,
} from 'src/mocks/socket';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ASK_TAROTCARD_MESSAGE_CANDIDATES,
  WELCOME_MESSAGE,
} from '@constants/socket';
import { LoggerService } from '@logger/logger.service';
import { ChatService } from '@chat/chat.service';
import { TarotService } from '@tarot/tarot.service';
import { SocketService } from './socket.service';

describe('SocketService', () => {
  let socketService: SocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketService,
        { provide: ChatService, useValue: chatServiceMock },
        { provide: TarotService, useValue: tarotServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
        { provide: 'ChatbotService', useValue: chatbotServiceMock },
      ],
    }).compile();

    socketService = module.get<SocketService>(SocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    socketService.initClient(clientMock);
  });

  it('SocketService 생성', () => {
    expect(socketService).toBeDefined();
  });

  it('client 소켓 초기화', () => {
    socketService.initClient(clientMock);
    expect(clientMock.chatLog).toEqual([]);
    expect(clientMock.chatEnd).toBeFalsy();
  });

  describe('SocketService.sendWelcomeMessage()', () => {
    it('token 단위로 메세지 전달', async () => {
      const sentMessage = await socketService.sendWelcomeMessage(clientMock);

      const emitNum = (clientMock.emit as jest.Mock).mock.calls.length;
      expect(emitNum).toBeGreaterThanOrEqual(3);

      expect(clientMock.emit).toHaveBeenCalledWith('streamStart');
      expect(clientMock.emit).toHaveBeenCalledWith(
        'streaming',
        expect.anything(),
      );
      expect(clientMock.emit).toHaveBeenCalledWith('streamEnd');

      expect(sentMessage).toEqual(WELCOME_MESSAGE);
    });

    it('chatLog 업데이트', async () => {
      await socketService.sendWelcomeMessage(clientMock);

      expect(clientMock.chatLog).toEqual([
        { isHost: true, message: WELCOME_MESSAGE },
      ]);
    });

    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('SocketService.handleMessageEvent()', () => {
    it('token 단위로 ai 답장 전달', async () => {
      const sentMessage = await socketService.handleMessageEvent(
        clientMock,
        humanMessageMock,
      );

      const emitNum = (clientMock.emit as jest.Mock).mock.calls.length;
      expect(emitNum).toBeGreaterThanOrEqual(3);

      expect(clientMock.emit).toHaveBeenCalledWith('streamStart');
      expect(clientMock.emit).toHaveBeenCalledWith(
        'streaming',
        expect.anything(),
      );
      expect(clientMock.emit).toHaveBeenCalledWith('streamEnd');

      expect(sentMessage).toEqual(aiMessageMock);
    });

    it('chatLog 업데이트', async () => {
      expect(clientMock.chatLog).toEqual([]);
      await socketService.handleMessageEvent(clientMock, humanMessageMock);

      expect(clientMock.chatLog).toEqual([
        { isHost: false, message: humanMessageMock },
        { isHost: true, message: aiMessageMock },
      ]);
    });

    it('ai가 타로 카드 뽑기 제안 시 tarotCard 이벤트 발생', async () => {
      jest.spyOn(socketService, 'streamMessage').mockImplementation(() => {
        return Promise.resolve(ASK_TAROTCARD_MESSAGE_CANDIDATES[0]);
      });
      await socketService.handleMessageEvent(clientMock, humanMessageMock);

      expect(clientMock.emit).toHaveBeenCalledWith('tarotCard');
    });
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('SocketService.handleTarotReadEvent()', () => {
    it('token 단위로 ai 답장 전달', async () => {
      const sentMessage = await socketService.handleTarotReadEvent(
        clientMock,
        tarotIdxMock,
      );

      const emitNum = (clientMock.emit as jest.Mock).mock.calls.length;
      expect(emitNum).toBeGreaterThanOrEqual(3);

      expect(clientMock.emit).toHaveBeenCalledWith('streamStart');
      expect(clientMock.emit).toHaveBeenCalledWith(
        'streaming',
        expect.anything(),
      );
      expect(clientMock.emit).toHaveBeenCalledWith('streamEnd');

      expect(sentMessage).toEqual(aiMessageMock);
    });

    it('chatLog 업데이트', async () => {
      expect(clientMock.chatLog).toEqual([]);
      await socketService.handleTarotReadEvent(clientMock, tarotIdxMock);

      expect(clientMock.chatLog).toEqual([
        { isHost: true, message: aiMessageMock },
      ]);
    });

    it('타로 결과 DB에 저장하고, client에게 결과 링크 ID 전달', async () => {
      const shareLinkIdMock = 'shareLinkId';
      jest
        .spyOn(tarotServiceMock, 'createTarotResult')
        .mockImplementation(() => Promise.resolve(TarotResultMock));

      await socketService.handleTarotReadEvent(clientMock, tarotIdxMock);

      expect(tarotServiceMock.createTarotResult).toHaveBeenCalled();
      expect(clientMock.emit).toHaveBeenCalledWith('chatEnd', shareLinkIdMock);
    });

    it('채팅 종료 상태 업데이트', async () => {
      expect(clientMock.chatEnd).toBeFalsy();
      await socketService.handleTarotReadEvent(clientMock, tarotIdxMock);
      expect(clientMock.chatEnd).toBeTruthy();
    });

    it('chatLog DB에 저장', async () => {
      await socketService.handleTarotReadEvent(clientMock, tarotIdxMock);
      expect(chatServiceMock.createMessages).toHaveBeenCalled();
    });

    it('오류 발생 시 client에게 알림', () => {});
  });
});

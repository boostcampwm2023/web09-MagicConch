import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from 'src/chat/chat.service';
import { WELCOME_MESSAGE } from 'src/common/constants/socket';
import {
  aiMessageMock,
  chatServiceMock,
  chatbotServiceMock,
  clientMock,
  humanMessageMock,
  loggerServiceMock,
  tarotServiceMock,
} from 'src/common/mocks/socket';
import { LoggerService } from 'src/logger/logger.service';
import { TarotService } from 'src/tarot/tarot.service';
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

  describe('sendWelcomeMessage()', () => {
    it('token 단위로 메세지 전달', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('handleMessageEvent()', () => {
    it('token 단위로 ai 답장 전달', () => {});
    it('chatLog 업데이트', () => {});
    it('ai가 타로 카드 뽑기 제안 시 tarotCard 이벤트 발생', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('handleTarotReadEvent()', () => {
    it('token 단위로 ai 답장 전달', () => {});
    it('chatLog 업데이트', () => {});
    it('타로 결과 DB에 저장하고, client에게 결과 링크 ID 전달', () => {});
    it('채팅 종료 상태 업데이트', () => {});
    it('chatLog DB에 저장', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  describe('streamMessage()', () => {
    it('stream 시작을 알림', () => {});
    it('token 단위로 client에게 메세지 전달', () => {});
    it('stream 종료을 알림', () => {});
    it('chatLog 업데이트', () => {});
    it('완성된 메세지 반환', () => {});
    it('오류 발생 시 client에게 알림', () => {});
  });

  it('test (3): 타로 상담 결과 생성', async () => {});
});

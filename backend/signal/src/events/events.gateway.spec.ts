import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { LoggerService } from 'src/logger/logger.service';
import { EventsGateway } from './events.gateway';

const socketHostMock = {
  id: 'testSocketId',
  roomId: 'testRoomId',
  role: 'host',
};
const socketGuestMock = {
  id: 'testSocketId',
  roomId: 'testRoomId',
  role: 'host',
};

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        {
          provide: LoggerService,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get(EventsGateway);
    server = gateway.server;
  });

  afterAll(() => {
    gateway['socketRooms'] = {};
    gateway['users'] = {};
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('유저가 들어올시', () => {
    it('connected 로그 찍음', () => {
      const socketHostMock = { id: 'testSocketId' };
      gateway.handleConnection(socketHostMock as any);
      expect(gateway['logger'].debug).toHaveBeenCalledWith(
        '🚀 Client Connected : testSocketId',
      );
    });
  });

  describe('유저가 나갈시', () => {
    it('disconnect 로깅', () => {
      const socketHostMock = { id: 'testSocketId' };
      gateway.handleDisconnect(socketHostMock as any);
      expect(gateway['logger'].debug).toHaveBeenCalledWith(
        '🚀 Client Disconnected : testSocketId',
      );
    });

    it('접속한적 없는 유저가 연결을 끊을시 로깅', () => {
      const socketHostMock = { id: 'testSocketId' };
      gateway.handleDisconnect(socketHostMock as any);
      expect(gateway['logger'].debug).toHaveBeenCalledWith(
        '🚀 접속된 유저가 존재하지 않음 userId: testSocketId',
      );
    });

    it('정상적인 id but, 올바르지 않은 roomId -> user목록에서 삭제 + 로깅', () => {
      gateway['users'] = { testSocketId: { ...socketHostMock } };
      gateway.handleDisconnect(socketHostMock as any);

      expect(gateway['logger'].debug).toHaveBeenCalledWith(
        '🚀 존재하지 않는 roomId: testRoomId',
      );
      expect(gateway['users']).toEqual({});
    });

    it('정상적인 id와 roomId, host가 나갈경우 -> room제거 + 로깅', () => {});

    it('정상적인 id와 roomId, host가 나갈경우 -> room에서 userId 해당하는 유저제거 + 로깅', () => {});
  });
});

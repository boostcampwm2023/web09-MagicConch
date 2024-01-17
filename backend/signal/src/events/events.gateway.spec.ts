import { Test } from '@nestjs/testing';
import { LoggerService } from 'src/logger/logger.service';
import { loggerServiceMock } from 'src/mocks/events/logger.mock';
import {
  onlyHostInsideRoomMock,
  roomMock,
  twoPeopleInsideRoomMock,
} from 'src/mocks/events/room.mock';
import {
  SocketMock,
  guestSocketMock,
  hostSocketMock,
} from 'src/mocks/events/socket.mock';
import {
  onlyHostInsideUsersMock,
  twoPeopleInsideUsersMock,
} from 'src/mocks/events/user.mock';
import { EventsGateway } from './events.gateway';

const expectEmitToRoom = (
  hostSocket: SocketMock,
  roomId: string,
  eventName: string,
  ...args: any[]
) => {
  expect(hostSocket.to).toHaveBeenCalledWith(roomId);
  expect(hostSocket.to(roomId).emit).toHaveBeenCalledWith(eventName, ...args);
};

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let loggerService: LoggerService;
  let hostSocket: any;
  let guestSocket: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        EventsGateway,
        { provide: LoggerService, useValue: loggerServiceMock },
      ],
    }).compile();

    gateway = moduleRef.get<EventsGateway>(EventsGateway);
    loggerService = moduleRef.get<LoggerService>(LoggerService);
    hostSocket = hostSocketMock;
    guestSocket = guestSocketMock;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection()', () => {
    it('소켓이 들어오면 로그 찍힘', () => {
      gateway.handleConnection(guestSocket as any);
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Client Connected : ${guestSocket.id}`,
      );
    });
  });

  describe('handleDisconnect()', () => {
    it('기본: Disconnected 로그 찍힘', () => {
      gateway.handleDisconnect(guestSocket);
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Client Disconnected : ${guestSocket.id}`,
      );
    });

    it('socket이 비정상(users에 존재하지 않는 socket.id): 로그 찍힘', () => {
      gateway.handleDisconnect(guestSocket);
      expect(loggerService.warn).toHaveBeenCalledWith(
        `🚀 접속된 유저가 존재하지 않음 userId: ${guestSocket.id}`,
      );
    });

    it('socket이 비정상(socketRooms에 존재하지 않는 roomId): 로그 찍힘', () => {
      gateway['users'] = twoPeopleInsideUsersMock();
      gateway.handleDisconnect(guestSocket);
      expect(loggerService.warn).toHaveBeenCalledWith(
        `🚀 존재하지 않는 roomId: ${roomMock.roomId}`,
      );
    });

    it('socket이 정상: 유저 목록에서 제거됨', () => {
      gateway['users'] = twoPeopleInsideUsersMock();
      gateway.handleDisconnect(guestSocket);
      expect(gateway['users']).toEqual(onlyHostInsideUsersMock());
    });

    it('socket이 정상(host): 방 제거, 방에 "hostExit" 이벤트 보냄', () => {
      gateway['users'] = twoPeopleInsideUsersMock();
      gateway['socketRooms'] = twoPeopleInsideRoomMock();

      gateway.handleDisconnect(hostSocket);

      expect(gateway['socketRooms']).toEqual({});
      expectEmitToRoom(hostSocket, roomMock.roomId, 'hostExit');
    });

    it('socket이 정상(guest): 방에서 유저 제거, 방에 "userExit" 이벤트 보냄', () => {
      gateway['users'] = twoPeopleInsideUsersMock();
      gateway['socketRooms'] = twoPeopleInsideRoomMock();

      gateway.handleDisconnect(guestSocket);

      expect(gateway['socketRooms']).toEqual(onlyHostInsideRoomMock());
      expectEmitToRoom(guestSocket, roomMock.roomId, 'userExit', {
        id: guestSocket.id,
      });
    });
  });

  describe('generateRoomName 이벤트[handleCreateRoomEvent()] on', () => {
    it('roomName 랜덤하게 생성 후 해당 소켓에 "roomNameGenerated" 이벤트 보냄', () => {
      gateway.handleCreateRoomEvent(guestSocket);
      expect(guestSocket.emit).toHaveBeenCalledWith(
        'roomNameGenerated',
        expect.any(String),
      );
    });
  });

  describe('createRoom 이벤트 [handleSetRoomPassword()] on', () => {
    it('socket.join(roomId)하고 users에 id추가, socketRooms에 유저 추가함', () => {
      gateway.handleSetRoomPassword(hostSocket, [
        roomMock.roomId,
        roomMock.password,
      ]);
      expect(hostSocket.join).toHaveBeenCalledWith(roomMock.roomId);
      expect(gateway['users']).toEqual(onlyHostInsideUsersMock());
      expect(gateway['socketRooms']).toEqual(onlyHostInsideRoomMock());
    });
  });

  describe('joinRoom 이벤트 [handleJoinRoomEvent()] on', () => {
    it('이벤트와 함께온 roomId가 잘못됨: 해당 소켓에 "joinRoomFailed발생" 이벤트 보냄', () => {
      gateway['socketRooms'] = {};
      gateway.handleJoinRoomEvent(guestSocket, [
        roomMock.wrongRoomId,
        roomMock.password,
      ]);
      expect(guestSocket.emit).toHaveBeenCalledWith('joinRoomFailed');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Invalid Room : ${roomMock.wrongRoomId}`,
      );
    });

    it('이벤트와 함께온 비밀번호가 틀림: 해당 소켓에 "joinRoomFailed발생" 이벤트 보냄', () => {
      gateway['socketRooms'] = { ...onlyHostInsideRoomMock() };
      gateway.handleJoinRoomEvent(guestSocket, [
        roomMock.roomId,
        roomMock.wrongPassword,
      ]);
      expect(guestSocket.emit).toHaveBeenCalledWith('joinRoomFailed');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Wrong Password for ${roomMock.roomId}`,
      );
    });

    it('방이 꽉참: 해당 소켓에 "roomFull" 이벤트 보냄', () => {
      gateway['socketRooms'] = twoPeopleInsideRoomMock();
      gateway.handleJoinRoomEvent(guestSocket, [
        roomMock.roomId,
        roomMock.password,
      ]);
      expect(guestSocket.emit).toHaveBeenCalledWith('roomFull');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Cannot Join to full room ${roomMock.roomId}`,
      );
    });

    it(`이벤트 성공적으로 발생:
  \t  1. users와 socketRooms에 추가 
  \t  2. socket.join(roomId) 실행됨
  \t  3. 방에 welcome 이벤트 발생
  \t  4. 해당 소켓에 "RoomSuccess" 이벤트 보냄`, () => {
      gateway['users'] = onlyHostInsideUsersMock();
      gateway['socketRooms'] = onlyHostInsideRoomMock();
      gateway.handleJoinRoomEvent(guestSocket, [
        roomMock.roomId,
        roomMock.password,
      ]);

      expect(gateway['users']).toEqual(twoPeopleInsideUsersMock());
      expect(gateway['socketRooms']).toEqual(twoPeopleInsideRoomMock());

      expect(guestSocket.join).toHaveBeenCalledWith(roomMock.roomId);

      expectEmitToRoom(guestSocket, roomMock.roomId, 'welcome', [
        hostSocketMock.id,
      ]);

      expect(guestSocket.emit).toHaveBeenCalledWith(
        'joinRoomSuccess',
        roomMock.roomId,
      );
    });
  });

  describe('signal 이벤트 (offer, answer, candidate) on', () => {
    it('offer 이벤트: 방에 offer이벤트에 받은 sdp 보냄', () => {
      gateway.handleOfferEvent(hostSocket, ['sdp' as any, roomMock.roomId]);

      expectEmitToRoom(hostSocket, roomMock.roomId, 'offer', 'sdp');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Offer Received from ${hostSocket.id}`,
      );
    });

    it('answer 이벤트: 방에 answer이벤트에 받은 sdp 보냄', () => {
      gateway.handleAnswerEvent(guestSocket, ['sdp' as any, roomMock.roomId]);

      expectEmitToRoom(guestSocket, roomMock.roomId, 'answer', 'sdp');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Answer Received from ${guestSocket.id}`,
      );
    });

    it('candidate 이벤트: 방에 candidate이벤트에 받은 candidate 보냄', () => {
      gateway.handleCandidateEvent(guestSocket, ['candidate' as any, 'roomId']);

      expectEmitToRoom(guestSocket, 'roomId', 'candidate', 'candidate');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Candidate Received from ${guestSocket.id}`,
      );
    });
  });

  describe('checkRoomExist 이벤트 [handleCheckRoomExistEvent()] on', () => {
    it('roomId에 해당하는 방이 존재함: 해당 소켓에 "roomExist" 이벤트 보냄', () => {
      gateway['users'] = onlyHostInsideUsersMock();
      gateway['socketRooms'] = onlyHostInsideRoomMock();
      gateway.handleCheckRoomExistEvent(guestSocket, roomMock.roomId);

      expect(guestSocket.emit).toHaveBeenCalledWith('roomExist');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Room Exist : ${roomMock.roomId}`,
      );
    });

    it('roomId에 해당하는 방이 존재하지 않음: 해당 소켓에 "roomNotExist" 이벤트 보냄', () => {
      gateway['users'] = onlyHostInsideUsersMock();
      gateway.handleCheckRoomExistEvent(guestSocket, roomMock.wrongPassword);

      expect(guestSocket.emit).toHaveBeenCalledWith('roomNotExist');
      expect(loggerService.debug).toHaveBeenCalledWith(
        `🚀 Room Not Exist : ${roomMock.wrongPassword}`,
      );
    });
  });
});

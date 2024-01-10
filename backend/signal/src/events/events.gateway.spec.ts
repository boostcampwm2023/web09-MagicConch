import { Test } from '@nestjs/testing';
import { LoggerService } from 'src/logger/logger.service';
import {
  SocketMock,
  guestSocketMock,
  hostSocketMock,
  loggerServiceMock,
  onlyHostInsideRoomMock,
  onlyHostInsideUsersMock,
  roomMock,
  twoPeopleInsideRoomMock,
  twoPeopleInsideUsersMock,
} from '../../mocks/eventGatewayMocks';
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

  it('소켓이 들어오면 로그 찍힘', () => {
    gateway.handleConnection(guestSocket as any);
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Client Connected : ${guestSocket.id}`,
    );
  });

  it('소켓 나가면 로그 찍힘', () => {
    gateway.handleDisconnect(guestSocket);
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Client Disconnected : ${guestSocket.id}`,
    );
  });

  it('소켓 나갔는데 존재하지 않는 유저라면 로그 찍힘', () => {
    gateway.handleDisconnect(guestSocket);
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 접속된 유저가 존재하지 않음 userId: ${guestSocket.id}`,
    );
  });

  it('소켓 나갔는데 존재하지 않는 roomId라면 로그 찍힘', () => {
    gateway['users'] = twoPeopleInsideUsersMock();
    gateway.handleDisconnect(guestSocket);
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 존재하지 않는 roomId: ${roomMock.roomId}`,
    );
  });

  it('소켓 나갔는데 정상적이면 유저 목록에서 제거됨', () => {
    gateway['users'] = twoPeopleInsideUsersMock();
    gateway.handleDisconnect(guestSocket);
    expect(gateway['users']).toEqual(onlyHostInsideUsersMock());
  });

  it('소켓 나갔는데 host라면 방 제거하고, hostExit이벤트 방에 발생', () => {
    gateway['users'] = twoPeopleInsideUsersMock();
    gateway['socketRooms'] = twoPeopleInsideRoomMock();

    gateway.handleDisconnect(hostSocket);

    expect(gateway['socketRooms']).toEqual({});
    expectEmitToRoom(hostSocket, roomMock.roomId, 'hostExit');
  });
  it('소켓 나갔는데 guest라면 방에서 유저 제거되고, userExit 이벤트 방에 발생', () => {
    gateway['users'] = twoPeopleInsideUsersMock();
    gateway['socketRooms'] = twoPeopleInsideRoomMock();

    gateway.handleDisconnect(guestSocket);

    expect(gateway['socketRooms']).toEqual(onlyHostInsideRoomMock());
    expectEmitToRoom(guestSocket, roomMock.roomId, 'userExit', {
      id: guestSocket.id,
    });
  });

  it('generateRoomName 이벤트 발생하면 socket.emit(roomNameGenerated)함', () => {
    gateway.handleCreateRoomEvent(guestSocket);
    expect(guestSocket.emit).toHaveBeenCalledWith(
      'roomNameGenerated',
      expect.any(String),
    );
  });

  it('createRoom 이벤트 발생하면 socket.join(roomId)하고 users와 socketRooms에 추가함', () => {
    gateway.handleSetRoomPassword(hostSocket, [
      roomMock.roomId,
      roomMock.password,
    ]);
    expect(hostSocket.join).toHaveBeenCalledWith(roomMock.roomId);
    expect(gateway['users']).toEqual(onlyHostInsideUsersMock());
    expect(gateway['socketRooms']).toEqual(onlyHostInsideRoomMock());
  });

  it('joinRoom 이벤트 발생했는데 방이 존재하지 않을경우 socket.joinRoomFailed발생', () => {
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

  it('joinRoom 이벤트 발생했는데 비밀번호가 틀릴경우 socket.joinRoomFailed발생', () => {
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

  it('joinRoom 이벤트 발생했는데 이미 방에 두명이상 있을경우 socket.roomFull', () => {
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

  it(`joinRoom 이벤트 성공적으로 발생하면 
  \t1. users와 socketRooms에 추가 
  \t2. 방에 welcomejoin 이벤트 발생
  \t3. socket.RoomSuccess 이벤트 발생시킴`, () => {
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

  it('offer 이벤트 발생하면 방에 offer이벤트 발생시킴', () => {
    gateway.handleOfferEvent(hostSocket, ['sdp' as any, roomMock.roomId]);

    expectEmitToRoom(hostSocket, roomMock.roomId, 'offer', 'sdp');
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Offer Received from ${hostSocket.id}`,
    );
  });

  it('answer 이벤트 발생하면 방에 answer이벤트 발생시킴', () => {
    gateway.handleAnswerEvent(guestSocket, ['sdp' as any, roomMock.roomId]);

    expectEmitToRoom(guestSocket, roomMock.roomId, 'answer', 'sdp');
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Answer Received from ${guestSocket.id}`,
    );
  });

  it('candidate 이벤트 발생하면 방에 candidate이벤트 발생시킴', () => {
    gateway.handleCandidateEvent(guestSocket, ['candidate' as any, 'roomId']);

    expectEmitToRoom(guestSocket, 'roomId', 'candidate', 'candidate');
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Candidate Received from ${guestSocket.id}`,
    );
  });

  it('checkRoomExist 이벤트 발생하고 방이 존재하면 socket.roomExist 발생', () => {
    gateway['users'] = onlyHostInsideUsersMock();
    gateway['socketRooms'] = onlyHostInsideRoomMock();
    gateway.handleCheckRoomExistEvent(guestSocket, roomMock.roomId);

    expect(guestSocket.emit).toHaveBeenCalledWith('roomExist');
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Room Exist : ${roomMock.roomId}`,
    );
  });

  it('checkRoomExist 이벤트 발생하고 방이 존재하지 않으면 socket.roomNotExist 발생', () => {
    gateway['users'] = onlyHostInsideUsersMock();
    gateway.handleCheckRoomExistEvent(guestSocket, roomMock.wrongPassword);

    expect(guestSocket.emit).toHaveBeenCalledWith('roomNotExist');
    expect(loggerService.debug).toHaveBeenCalledWith(
      `🚀 Room Not Exist : ${roomMock.wrongPassword}`,
    );
  });
});

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type {
  HumanClientEvent,
  HumanServerEvent,
} from '@tarotmilktea/human-socketio-event';
import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/logger/logger.service';
import { v4 } from 'uuid';

const MAXIMUM = 2;

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/signal',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: LoggerService) {}

  @WebSocketServer()
  server: Server;

  private socketRooms: any = {};
  private users: any = {};

  afterInit(server: Server) {
    this.logger.info('🚀 시그널링 서버 초기화');
  }

  handleConnection(socket: Socket) {
    this.logger.debug(`🚀 Client Connected : ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.debug(`🚀 Client Disconnected : ${socket.id}`);

    const userId = socket.id;
    const user = this.users[userId];

    if (!user) {
      this.logger.debug(`🚀 접속된 유저가 존재하지 않음 userId: ${userId}`);
      return;
    }

    const { roomId, role } = user;

    delete this.users[userId];

    if (!this.socketRooms[roomId]) {
      this.logger.debug(`🚀 존재하지 않는 roomId: ${roomId}`);
      return;
    }

    if (role === 'host') {
      this.eventEmitToRoom(socket, roomId, 'hostExit');
      delete this.socketRooms[roomId];

      this.logger.debug(`🚀 host Exit from ${roomId}`);
      this.logger.debug(`🚀 Room Deleted : ${roomId}`);
    } else if (role === 'guest') {
      this.socketRooms[roomId].users = this.socketRooms[roomId].users.filter(
        (_userId: string) => _userId !== userId,
      );

      this.eventEmitToRoom(socket, roomId, 'userExit', { id: userId });

      this.logger.debug(`🚀 User Exit from ${roomId}`);
    }
  }

  @SubscribeMessage<HumanClientEvent>('generateRoomName')
  handleCreateRoomEvent(socket: Socket) {
    const roomId: string = v4();

    this.eventEmit(socket, 'roomNameGenerated', roomId);

    this.logger.debug(`🚀 Room Name Generated : ${roomId}`);
  }
  @SubscribeMessage<HumanClientEvent>('createRoom')
  handleSetRoomPassword(socket: Socket, [roomId, password]: [string, string]) {
    const userId = socket.id;
    this.socketRooms[roomId] = { users: [userId], password: password };

    this.users[userId] = { roomId, role: 'host' };
    socket.join(roomId);
    this.eventEmit(socket, 'roomCreated');

    this.logger.debug(`🚀 Room Created : ${roomId}`);
  }

  @SubscribeMessage<HumanClientEvent>('joinRoom')
  handleJoinRoomEvent(socket: Socket, [roomId, password]: [string, string]) {
    const userId = socket.id;

    const existRoom: any = this.socketRooms[roomId];
    const wrongPassword: boolean =
      this.socketRooms[roomId].password !== password;

    if (!existRoom || wrongPassword) {
      this.eventEmit(socket, 'joinRoomFailed');
      const logMessage: string = existRoom
        ? `🚀 Invalid Room : ${roomId}`
        : `🚀 Wrong Password for ${roomId}`;
      this.logger.debug(logMessage);
      return;
    }

    const fullRoom: boolean = this.socketRooms[roomId].users.length === MAXIMUM;
    if (fullRoom) {
      this.logger.debug(`🚀 Cannot Join to full room ${roomId}`);
      this.eventEmit(socket, 'roomFull');
      return;
    }

    this.socketRooms[roomId].users.push(userId);
    this.users[userId] = { roomId, role: 'guest' };
    socket.join(roomId);
    this.logger.debug(`🚀 Join to room ${roomId}`);

    const otherUsers = this.socketRooms[roomId].users.filter(
      (_userId: string) => _userId !== userId,
    );
    this.eventEmitToRoom(socket, roomId, 'welcome', otherUsers);
    this.eventEmit(socket, 'joinRoomSuccess', roomId);
  }

  @SubscribeMessage<HumanClientEvent>('offer')
  handleOfferEvent(
    socket: Socket,
    [sdp, roomName]: [RTCSessionDescription, string],
  ) {
    this.logger.debug(`🚀 Offer Received from ${socket.id}`);
    this.eventEmitToRoom(socket, roomName, 'offer', sdp);
  }

  @SubscribeMessage<HumanClientEvent>('answer')
  handleAnswerEvent(
    socket: Socket,
    [sdp, roomName]: [RTCSessionDescription, string],
  ) {
    this.logger.debug(`🚀 Answer Received from ${socket.id}`);
    this.eventEmitToRoom(socket, roomName, 'answer', sdp);
  }

  @SubscribeMessage<HumanClientEvent>('candidate')
  handleCandidateEvent(
    socket: Socket,
    [candidate, roomName]: [RTCIceCandidate, string],
  ) {
    this.logger.debug(`🚀 Candidate Received from ${socket.id}`);
    this.eventEmitToRoom(socket, roomName, 'candidate', candidate);
  }

  @SubscribeMessage<HumanClientEvent>('checkRoomExist')
  handleCheckRoomExistEvent(socket: Socket, roomName: string) {
    const existRoom: any = this.socketRooms[roomName];

    if (existRoom) {
      this.eventEmit(socket, 'roomExist');
      this.logger.debug(`🚀 Room Exist : ${roomName}`);
    } else {
      this.eventEmit(socket, 'roomNotExist');
      this.logger.debug(`🚀 Room Not Exist : ${roomName}`);
    }
  }

  private eventEmit(socket: Socket, event: HumanServerEvent, ...args: any[]) {
    socket.emit(event, ...args);
  }
  private eventEmitToRoom(
    socket: Socket,
    roomName: string,
    event: HumanServerEvent,
    ...args: any[]
  ) {
    socket.to(roomName).emit(event, ...args);
  }
}

// socketManager.emit('checkRoomExist', roomName);
// socketManager.on('roomExist', () => {});
// socketManaget.on('roomNotExist', () => {});

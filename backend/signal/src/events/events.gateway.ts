import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as dotenv from 'dotenv';
import type {
  HumanServer,
  HumanSocket,
  HumanSocketClientEvent,
  HumanSocketClientEventParams,
} from 'socket-event';
import { LoggerService } from 'src/logger/logger.service';
import { v4 } from 'uuid';

dotenv.config();

const MAXIMUM = 2;

@WebSocketGateway({
  cors: { origin: process.env.CORS_ALLOW_DOMAIN, credentials: true },
  path: '/signal',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: LoggerService) {}

  @WebSocketServer()
  server: HumanServer;

  private socketRooms: any = {};
  private users: any = {};

  afterInit(server: HumanServer) {
    this.logger.info('🚀 시그널링 서버 초기화');
  }

  handleConnection(socket: HumanSocket) {
    this.logger.debug(`🚀 Client Connected : ${socket.id}`);
  }

  handleDisconnect(socket: HumanSocket) {
    this.logger.debug(`🚀 Client Disconnected : ${socket.id}`);

    const userId = socket.id;
    const user = this.users[userId];

    if (!user) {
      this.logger.warn(`🚀 접속된 유저가 존재하지 않음 userId: ${userId}`);
      return;
    }

    const { roomId, role } = user;

    delete this.users[userId];

    if (!this.socketRooms[roomId]) {
      this.logger.warn(`🚀 존재하지 않는 roomId: ${roomId}`);
      return;
    }

    if (role === 'host') {
      socket.to(roomId).emit('hostExit');
      delete this.socketRooms[roomId];

      this.logger.debug(`🚀 host Exit from ${roomId}`);
      this.logger.debug(`🚀 Room Deleted : ${roomId}`);
    } else if (role === 'guest') {
      this.socketRooms[roomId].users = this.socketRooms[roomId].users.filter(
        (_userId: string) => _userId !== userId,
      );

      socket.to(roomId).emit('userExit', { id: userId });

      this.logger.debug(`🚀 User Exit from ${roomId}`);
    }
  }

  @SubscribeMessage<HumanSocketClientEvent>('generateRoomName')
  handleCreateRoomEvent(socket: HumanSocket) {
    const roomId: string = v4();

    socket.emit('roomNameGenerated', roomId);

    this.logger.debug(`🚀 Room Name Generated : ${roomId}`);
  }
  @SubscribeMessage<HumanSocketClientEvent>('createRoom')
  handleSetRoomPassword(
    socket: HumanSocket,
    [roomId, password]: HumanSocketClientEventParams<'createRoom'>,
  ) {
    const userId = socket.id;
    this.socketRooms[roomId] = { users: [userId], password: password };

    this.users[userId] = { roomId, role: 'host' };
    socket.join(roomId);
    socket.emit('roomCreated');

    this.logger.debug(`🚀 Room Created : ${roomId}`);
  }

  @SubscribeMessage<HumanSocketClientEvent>('joinRoom')
  handleJoinRoomEvent(
    socket: HumanSocket,
    [roomId, password]: HumanSocketClientEventParams<'joinRoom'>,
  ) {
    const userId = socket.id;

    const existRoom: any = this.socketRooms[roomId];
    const wrongPassword: boolean =
      this.socketRooms[roomId]?.password !== password;

    if (!existRoom || wrongPassword) {
      socket.emit('joinRoomFailed');
      const logMessage: string = !existRoom
        ? `🚀 Invalid Room : ${roomId}`
        : `🚀 Wrong Password for ${roomId}`;
      this.logger.debug(logMessage);
      return;
    }

    const fullRoom: boolean = this.socketRooms[roomId].users.length === MAXIMUM;
    if (fullRoom) {
      this.logger.debug(`🚀 Cannot Join to full room ${roomId}`);
      socket.emit('roomFull');
      return;
    }

    this.socketRooms[roomId].users.push(userId);
    this.users[userId] = { roomId, role: 'guest' };
    socket.join(roomId);
    this.logger.debug(`🚀 Join to room ${roomId}`);

    const otherUsers = this.socketRooms[roomId].users.filter(
      (_userId: string) => _userId !== userId,
    );
    socket.to(roomId).emit('welcome', otherUsers);
    socket.emit('joinRoomSuccess', roomId);
  }

  @SubscribeMessage<HumanSocketClientEvent>('connection')
  handleConnectionEvent(
    socket: HumanSocket,
    ...[
      { description, candidate, roomName },
    ]: HumanSocketClientEventParams<'connection'>
  ) {
    try {
      if (description) {
        this.logger.debug(`🚀 ${description.type} Received from ${socket.id}`);
        socket.to(roomName).emit('connection', { description });
      } else if (candidate) {
        this.logger.debug(`🚀 Candidate Received from ${socket.id}`);
        socket.to(roomName).emit('connection', { candidate });
      }
    } catch (error) {
      this.logger.error(`🚀 Error in handleMessageEvent : ${error}`);
    }
  }

  @SubscribeMessage<HumanSocketClientEvent>('checkRoomExist')
  handleCheckRoomExistEvent(
    socket: HumanSocket,
    ...[roomName]: HumanSocketClientEventParams<'checkRoomExist'>
  ) {
    const existRoom: any = this.socketRooms[roomName];

    if (existRoom) {
      socket.emit('roomExist');
      this.logger.debug(`🚀 Room Exist : ${roomName}`);
    } else {
      socket.emit('roomNotExist');
      this.logger.debug(`🚀 Room Not Exist : ${roomName}`);
    }
  }
}

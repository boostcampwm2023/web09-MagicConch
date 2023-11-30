import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/logger/logger.service';
import { v4 } from 'uuid';

const cors: any = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['my-custom-header'],
  credentials: true,
};

const MAXIMUM = 2;

@WebSocketGateway({ cors: cors })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: LoggerService) {}

  @WebSocketServer()
  server: Server;

  private socketRooms = {};
  private users = {};

  afterInit(server: Server) {
    this.logger.info('🚀 시그널링 서버 초기화');
  }

  handleConnection(socket: Socket) {
    this.logger.debug(`🚀 Client Connected : ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.debug(`🚀 Client Disconnected : ${socket.id}`);

    const roomId: string = this.users[socket.id];
    if (this.socketRooms[roomId]) {
      this.socketRooms[roomId].users = this.socketRooms[roomId].filter(
        (userId: string) => userId !== socket.id,
      );
      if (this.socketRooms[roomId].users.length === 0) {
        delete this.socketRooms[roomId];
        this.logger.debug( `🚀 Room Deleted : ${roomId}`);
        return;
      }
    }
    delete this.users[roomId];

    socket.to(roomId).emit('userExit', { id: socket.id });
    this.logger.debug( `🚀 User Exit from ${roomId}`);
  }


  @SubscribeMessage('createRoom') 
  handleCreateRoomEvent(socket: Socket, password: string) {
    const roomId: string = v4();
    this.socketRooms[roomId] = { users: [socket.id], password: password };

    this.users[socket.id] = roomId;
    socket.join(roomId);
    socket.emit('roomCreated', roomId);

    this.logger.debug(`🚀 Room Created : ${roomId}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoomEvent(socket: Socket, roomId: string, password: string) {
    const existRoom = this.socketRooms[roomId];
    const wrongPassword = this.socketRooms[roomId].password !== password;
    
    if (!existRoom || wrongPassword) {
      socket.emit('joinRoomFailed');
      const logMessage: string = (existRoom) ? `🚀 Invalid Room : ${roomId}` : `🚀 Wrong Password for ${roomId}`;
      this.logger.debug(logMessage);
      return;
    }

    const fullRoom = this.socketRooms[roomId].users.length === MAXIMUM;
    if(fullRoom) {
      this.logger.debug(`🚀 Cannot Join to full room ${roomId}`);
        socket.emit('roomFull');
        return;
    }

    this.socketRooms[roomId].users.push(socket.id);
    this.users[socket.id] = roomId;
    socket.join(roomId);
    this.logger.debug(`🚀 Join to room ${roomId}`);

    const otherUsers = this.socketRooms[roomId].filter(
      (userId: string) => userId !== socket.id,
    );
    socket.to(roomId).emit('welcome', otherUsers);
    socket.emit('joinRoomSuccess', roomId);
  }

  @SubscribeMessage('offer')
  handleOfferEvent(socket: Socket, sdp, roomName: string) {
    this.logger.debug(`🚀 Offer Received from ${socket.id}`);
    socket.to(roomName).emit('offer', sdp);
  }

  @SubscribeMessage('answer')
  handleAnswerEvent(socket: Socket, sdp, roomName: string) {
    this.logger.debug(`🚀 Answer Received from ${socket.id}`);
    socket.to(roomName).emit('answer', sdp);
  }

  @SubscribeMessage('candidate')
  handleCandidateEvent(socket: Socket, candidate, roomName: string) {
    this.logger.debug(`🚀 Candidate Received from ${socket.id}`);
    socket.to(roomName).emit('candidate', candidate);
  }
}

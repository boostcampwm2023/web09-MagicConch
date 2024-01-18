import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'src/common/types/socket';
import { LoggerService } from 'src/logger/logger.service';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly logger: LoggerService,
  ) {}

  afterInit(server: Server) {
    this.logger.info('🚀 웹소켓 서버 초기화');
  }

  handleConnection(client: any) {
    this.logger.debug(`🚀 Client Connected : ${client.id}`);

    this.socketService.initClient(client);
    this.socketService.sendWelcomeMessage(client);
  }

  @SubscribeMessage('message')
  async handleMessageEvent(client: Socket, message: string) {
    this.logger.debug(`🚀 Received a message from ${client.id}`);

    const sentMessage = await this.socketService.handleMessageEvent(
      client,
      message,
    );
    this.logger.debug(`🚀 Send a message to ${client.id}: ${sentMessage}`);
  }

  @SubscribeMessage('tarotRead')
  async handleTarotReadEvent(client: Socket, cardIdx: number) {
    this.logger.debug(
      `🚀 TarotRead request received from ${client.id}: ${cardIdx}`,
    );

    const sentMessage = await this.socketService.handleTarotReadEvent(
      client,
      cardIdx,
    );
    this.logger.debug(`🚀 Send a message to ${client.id}: ${sentMessage}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`🚀 Client Disconnected : ${client.id}`);
  }
}

import * as dotenv from 'dotenv';
import type {
  AiServer,
  AiSocketClientEvent,
  AiSocketClientEventParams,
} from 'socket-event';
import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { ExtendedAiSocket as AiSocket } from '@common/types/socket';
import { LoggerService } from '@logger/logger.service';
import { SocketJwtAuthGuard } from '@auth/guard';
import { SocketService } from './socket.service';

dotenv.config();

@WebSocketGateway({
  cors: { origin: process.env.CORS_ALLOW_DOMAIN, credentials: true },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  readonly server: AiServer;

  constructor(
    private readonly socketService: SocketService,
    private readonly logger: LoggerService,
  ) {}

  afterInit(server: AiServer) {
    this.logger.info('🚀 웹소켓 서버 초기화');
  }

  handleConnection(client: AiSocket) {
    this.logger.debug(`🚀 Client Connected : ${client.id}`);

    this.socketService.initClient(client);
    this.socketService.sendWelcomeMessage(client);
  }

  @SubscribeMessage<AiSocketClientEvent>('message')
  async handleMessageEvent(
    client: AiSocket,
    ...params: AiSocketClientEventParams<'message'>
  ) {
    this.logger.debug(`🚀 Received a message from ${client.id}`);

    await this.socketService.handleMessageEvent(client, ...params);

    this.logger.debug(`🚀 Send a message to ${client.id}`);
  }

  @UseGuards(SocketJwtAuthGuard)
  @SubscribeMessage<AiSocketClientEvent>('tarotRead')
  async handleTarotReadEvent(
    client: AiSocket,
    ...params: AiSocketClientEventParams<'tarotRead'>
  ) {
    this.logger.debug(`🚀 TarotRead request received from ${client.id}`);

    const sentMessage = await this.socketService.handleTarotReadEvent(
      client,
      ...params,
    );
    this.logger.debug(`🚀 Send a message to ${client.id}: ${sentMessage}`);
  }

  handleDisconnect(client: AiSocket) {
    this.logger.debug(`🚀 Client Disconnected : ${client.id}`);
  }
}

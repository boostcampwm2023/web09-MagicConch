// src/events/events.gateway.ts
import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createTarotReading } from './clova';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화 ✅');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);

    const sendMessage = (message: string) => {
      client.emit('message', message);
    };

    const welcomeMessage =
      '안녕, 나는 어떤 고민이든지 들어주는 마법의 소라고둥이야!\n고민이 있으면 말해줘!';

    setTimeout(() => {
      sendMessage(welcomeMessage);
    }, 2000);

    client.on('message', async (message) => {
      this.logger.log(`Client Message : ${message}`);
      const result = await createTarotReading(message, '0번 바보 카드');
      this.logger.log(`Tarot Reading : ${result}`);
      sendMessage(result);
    });
  }
}

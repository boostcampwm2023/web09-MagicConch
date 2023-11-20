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

      // 임시로 랜덤으로 타로 카드 뽑기
      const random = Math.floor(Math.random() * 22);
      const tarotName= ['바보','마법사','여사제','여황제','황제','교황','연인','전차','힘','은둔자','운명의 수레바퀴','정의','매달린 남자','죽음','절제','악마','탑','별','달','태양','심판','세계' ]
      const result = await createTarotReading(message, `${random}번 ${tarotName[random]}카드`);
      this.logger.log(`Tarot Reading : ${tarotName[random]}, ${result}`);
      sendMessage(result);
    });
  }
}

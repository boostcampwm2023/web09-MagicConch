// src/events/events.gateway.ts
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { reamdomWithRange } from 'src/common/utils/ramdomWithRange';
import { Chat, createTalk, createTarotReading, initChatLog } from './clova';
import { maxChatCount, minChatCount } from './constants';

interface MySocket extends Socket {
  chatLog: Chat[];
  chatCount: number;
}

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

  handleConnection(client: MySocket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client.id}`);

    client.chatLog = initChatLog();
    client.chatCount = reamdomWithRange(minChatCount, maxChatCount);

    const welcomeMessage =
      '안녕, 나는 어떤 고민이든지 들어주는 마법의 소라고둥이야!\n고민이 있으면 말해줘!';

    setTimeout(() => {
      client.emit('message', welcomeMessage);
      client.chatLog.push({ role: 'assistant', content: welcomeMessage });
    }, 2000);

    client.on('message', async (message) => {
      this.logger.log(`message: ${message}`);
      client.chatCount -= 1;

      const result = await createTalk(client.chatLog, message);
      if (result) {
        readStreamAndSend(client, result.getReader(), () => {
          if (client.chatCount <= 0) {
            client.emit('message', '이제 타로를 뽑아 볼까?');
            client.emit('tarotCard');
          }
        });
      }
    });

    client.on('tarotRead', async (cardName) => {
      this.logger.log(`requestTarotReading`);

      const result = await createTarotReading(client.chatLog, cardName);
      if (result) {
        readStreamAndSend(client, result.getReader());
      }
    });
  }
}

function readStreamAndSend(
  socket: MySocket,
  reader: ReadableStreamDefaultReader<Uint8Array>,
  callback?: () => void,
) {
  let message = '';
  socket.emit('message', message);

  const readStream = () => {
    reader?.read().then(({ done, value }) => {
      if (done) {
        socket.chatLog.push({ role: 'assistant', content: message });
        socket.emit('streamEnd');
        if (callback) {
          callback();
        }
        return;
      }
      message += new TextDecoder().decode(value);
      socket.emit('messageUpdate', message);

      return readStream();
    });
  };
  readStream();
}

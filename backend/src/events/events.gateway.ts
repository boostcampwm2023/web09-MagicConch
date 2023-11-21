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
import { Chat, createTalk, createTarotReading, initChatLog } from './clova';
import {
  askTarotCardMessage,
  chatEndMessage,
  welcomeMessage,
} from './constants';

interface MySocket extends Socket {
  chatLog: Chat[];
  chatEnd: boolean;
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
    client.chatEnd = false;

    setTimeout(() => {
      client.emit('message', welcomeMessage);
      client.chatLog.push({ role: 'assistant', content: welcomeMessage });
    }, 2000);

    const messageEventHandler = async (message: string) => {
      if (client.chatEnd) return;

      const result = await createTalk(client.chatLog, message);
      if (result) {
        readStreamAndSend(client, result.getReader());
      }
    };
    const tarotReadEventHandler = async (cardName: string) => {
      const result = await createTarotReading(client.chatLog, cardName);
      if (result) {
        const chatEndEvent = () => client.emit('chatEnd', chatEndMessage);
        readStreamAndSend(client, result.getReader(), chatEndEvent);
      }
    };

    client.on('message', messageEventHandler);
    client.on('tarotRead', tarotReadEventHandler);
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
        socket.emit('streamEnd');
        socket.chatLog.push({ role: 'assistant', content: message });

        if (message.includes(askTarotCardMessage)) {
          socket.chatEnd = true;
          setTimeout(() => socket.emit('tarotCard'), 1000);
        }

        if (callback) {
          setTimeout(callback, 3000);
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

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService, ChattingInfo } from 'src/chat/chat.service';
import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import { __DEV__ } from 'src/node.env';
import { CreateTarotResultDto } from 'src/tarot/dto/create-tarot-result.dto';
import { TarotService } from 'src/tarot/tarot.service';
import ClovaStudio, { Chat } from './clovaStudio';
import {
  askTarotCardMessage,
  chatEndMessage,
  tarotCardNames,
  welcomeMessage,
} from './constants';

const bucketUrl: string = 'https://kr.object.ncloudstorage.com/magicconch';

interface MySocket extends Socket {
  memberId: string;
  chatLog: Chat[];
  chatEnd: boolean;
  chatRoomId: string;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  chatService: ChatService;
  tarotService: TarotService;

  clovaStudio: ClovaStudio;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    if (!__DEV__) {
      this.chatService = await this.moduleRef.create(ChatService);
      this.tarotService = await this.moduleRef.create(TarotService);
    }

    const X_NCP_APIGW_API_KEY = this.configService.get('X_NCP_APIGW_API_KEY');
    const X_NCP_CLOVASTUDIO_API_KEY = this.configService.get(
      'X_NCP_CLOVASTUDIO_API_KEY',
    );

    this.clovaStudio = new ClovaStudio(
      X_NCP_APIGW_API_KEY,
      X_NCP_CLOVASTUDIO_API_KEY,
    );
  }

  @WebSocketServer()
  server: Server;

  private readonly logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('🚀 웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🚀 Client Disconnected : ${client.id}`);
  }

  handleConnection(client: MySocket, ...args: any[]) {
    this.logger.log(`🚀 Client Connected : ${client.id}`);

    client.chatLog = [];
    this.clovaStudio.initChatLog(client.chatLog);

    client.chatEnd = false;

    // 채팅방 INSERT
    if (!__DEV__) {
      const createRoom = async () => {
        const chattingInfo: ChattingInfo = await this.chatService.createRoom(
          client.id,
        );
        client.memberId = chattingInfo.memeberId;
        client.chatRoomId = chattingInfo.roomId;
      };

      createRoom();
    }

    setTimeout(() => {
      client.emit('message', welcomeMessage);
      client.chatLog.push({ role: 'assistant', content: welcomeMessage });
    }, 2000);
  }

  @SubscribeMessage('message')
  async handleMessageEvent(client: MySocket, message: string) {
    this.logger.log(`🚀 Received a message from ${client.id}: ${message}`);
    if (client.chatEnd) return;

    const result = await this.clovaStudio.createTalk(client.chatLog, message);
    if (result) {
      this.readStreamAndSend(client, result.getReader());
    }
  }

  @SubscribeMessage('tarotRead')
  async handleTarotReadEvent(client: MySocket, cardIdx: number) {
    this.logger.log(
      `🚀 TarotRead request received from ${client.id}: ${cardIdx}번 ${tarotCardNames[cardIdx]}`,
    );

    const result = await this.clovaStudio.createTarotReading(
      client.chatLog,
      tarotCardNames[cardIdx],
    );
    if (result) {
      this.readStreamAndSend(client, result.getReader(), () =>
        this.chatEndEvent(client, cardIdx),
      );
    }
  }

  chatEndEvent(client: MySocket, cardIdx: Number) {
    client.emit('chatEnd', chatEndMessage);

    if (__DEV__) return;

    const chatLog: Chat[] = client.chatLog;

    const makeMessageDto = (
      message: Chat,
    ): CreateChattingMessageDto | undefined => {
      const messageDto = new CreateChattingMessageDto();
      if (message.role === 'system') {
        return undefined;
      }
      messageDto.isHost = message.role === 'assistant';
      messageDto.message = message.content;
      return messageDto;
    };

    const isCreateChattingMessageDto = (
      message: CreateChattingMessageDto | undefined,
    ): message is CreateChattingMessageDto =>
      message instanceof CreateChattingMessageDto;

    const parsingMessage: CreateChattingMessageDto[] = chatLog
      .map(makeMessageDto)
      .filter(isCreateChattingMessageDto);

    const createChattingMessageDto = parsingMessage
      .slice(0, -2)
      .concat(parsingMessage.slice(-1));

    // 채팅 메시지 INSERT
    this.chatService.createMessage(client.chatRoomId, createChattingMessageDto);

    // 타로 결과 INSERT
    const makeTarotResult = async (tarotResult: string) => {
      const createTarotResultDto: CreateTarotResultDto =
        new CreateTarotResultDto();
      createTarotResultDto.cardUrl = `${bucketUrl}/basic/${cardIdx}.jpg`;
      createTarotResultDto.message = tarotResult;

      const tarotResultId: string =
        await this.tarotService.createTarotResult(createTarotResultDto);
      console.log(tarotResultId);
    };

    const totalMsgCnt: number = chatLog.length;
    makeTarotResult(chatLog[totalMsgCnt - 1].content);
  }

  readStreamAndSend(
    client: MySocket,
    reader: ReadableStreamDefaultReader<Uint8Array>,
    callback?: () => void,
  ) {
    let message = '';
    client.emit('message', message);

    const readStream = () => {
      reader?.read().then(({ done, value }) => {
        if (done) {
          client.emit('streamEnd');
          client.chatLog.push({ role: 'assistant', content: message });

          this.logger.log(`🚀 Message sent to ${client.id}: ${message}`);

          if (message.includes(askTarotCardMessage)) {
            client.chatEnd = true;
            client.emit('tarotCard');
          }

          if (callback) {
            setTimeout(callback, 3000);
          }
          return;
        }
        message += new TextDecoder().decode(value);
        client.emit('messageUpdate', message);

        return readStream();
      });
    };
    readStream();
  }
}

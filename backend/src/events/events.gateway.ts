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
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService, ChattingInfo } from 'src/chat/chat.service';
import { __DEV__ } from 'src/node.env';
import { TarotService } from 'src/tarot/tarot.service';
import ClovaStudio from './clova-studio';
import {
  askTarotCardCandidates,
  tarotCardNames,
  welcomeMessage,
} from './constants';
import {
  chatLog2createChattingMessageDtos,
  result2createTarotResultDto,
} from './create-dto-helper';
import { readTokenStream, string2TokenStream } from './stream';
import type { MySocket } from './type';

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

    if (!__DEV__) {
      this.createRoom(client);
    }

    setTimeout(() => this.welcome(client), 2000);
  }

  @SubscribeMessage('message')
  async handleMessageEvent(client: MySocket, message: string) {
    this.logger.log(`🚀 Received a message from ${client.id}: ${message}`);
    if (client.chatEnd) return;

    client.emit('streamStart');

    const stream = await this.clovaStudio.createTalk(client.chatLog, message);

    if (stream) {
      const sentMessage = await this.streamMessage(client, stream);

      const askedTarotCard = askTarotCardCandidates.some(sentMessage.includes);
      if (askedTarotCard) {
        client.emit('tarotCard');
      }
    }
  }

  @SubscribeMessage('tarotRead')
  async handleTarotReadEvent(client: MySocket, cardIdx: number) {
    this.logger.log(
      `🚀 TarotRead request received from ${client.id}: ${cardIdx}번 ${tarotCardNames[cardIdx]}`,
    );

    client.emit('streamStart');

    const stream = await this.clovaStudio.createTarotReading(
      client.chatLog,
      tarotCardNames[cardIdx],
    );
    if (stream) {
      const sentMessage = await this.streamMessage(client, stream);

      this.saveChatLog(client);
      const shareLinkId = await this.createShareLinkId(cardIdx, sentMessage);

      client.emit('chatEnd', shareLinkId);
    }
  }

  private async createRoom(client: MySocket) {
    const chattingInfo: ChattingInfo = await this.chatService.createRoom(
      client.id,
    );
    client.memberId = chattingInfo.memeberId;
    client.chatRoomId = chattingInfo.roomId;
  }

  private welcome(client: MySocket) {
    client.emit('streamStart');

    const stream = string2TokenStream(welcomeMessage);
    this.streamMessage(client, stream);
  }

  private async streamMessage(
    client: MySocket,
    stream: ReadableStream<Uint8Array>,
  ) {
    const onStreaming = (token: string) => client.emit('streaming', token);
    const sentMessage = await readTokenStream(stream, onStreaming);

    this.logger.log(`🚀 Send a message to client: ${sentMessage}`);
    client.emit('streamEnd');

    return sentMessage;
  }

  private async saveChatLog(client: MySocket) {
    if (__DEV__) return;

    try {
      const createChattingMessageDto = chatLog2createChattingMessageDtos(
        client.chatLog,
      );
      this.chatService.createMessage(
        client.chatRoomId,
        createChattingMessageDto,
      );
    } catch (error) {
      throw new WsException('채팅 로그를 저장하는데 실패했습니다.');
    }
  }

  private async createShareLinkId(
    cardIdx: number,
    result: string,
  ): Promise<string> {
    if (__DEV__) return 'DEV';

    try {
      const createTarotResultDto = result2createTarotResultDto(cardIdx, result);
      return await this.tarotService.createTarotResult(createTarotResultDto);
    } catch (error) {
      throw new WsException('타로 결과를 저장하는데 실패했습니다.');
    }
  }
}

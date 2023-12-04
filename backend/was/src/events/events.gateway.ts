import { ConfigService } from '@nestjs/config';
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
import { ERR_MSG } from 'src/common/constants/errors';
import { LoggerService } from 'src/logger/logger.service';
import { CreateTarotResultDto } from 'src/tarot/dto/create-tarot-result.dto';
import { TarotService } from 'src/tarot/tarot.service';
import {
  askTarotCardCandidates,
  tarotCardNames,
  welcomeMessage,
} from '../common/constants/events';
import ClovaStudio from './clova-studio';
import { createChattingMessageDtos } from './create-dto-helper';
import { readTokenStream, string2TokenStream } from './stream';
import type { MySocket } from './type';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  clovaStudio: ClovaStudio;

  constructor(
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly tarotService: TarotService,
    private readonly logger: LoggerService,
  ) {
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

  afterInit(server: Server) {
    this.logger.info('🚀 웹소켓 서버 초기화');
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`🚀 Client Disconnected : ${client.id}`);
  }

  handleConnection(client: MySocket, ...args: any[]) {
    this.logger.debug(`🚀 Client Connected : ${client.id}`);

    client.chatLog = [];
    this.clovaStudio.initChatLog(client.chatLog);

    client.chatEnd = false;

    this.createRoom(client);

    setTimeout(() => this.welcome(client), 2000);
  }

  @SubscribeMessage('message')
  async handleMessageEvent(client: MySocket, message: string) {
    this.logger.debug(`🚀 Received a message from ${client.id}`);

    if (client.chatEnd) {
      return;
    }
    client.emit('streamStart');

    const stream = await this.clovaStudio.createTalk(client.chatLog, message);
    if (stream) {
      const sentMessage = await this.streamMessage(client, stream);

      const askedTarotCard = askTarotCardCandidates.some((candidates) =>
        sentMessage.includes(candidates),
      );
      if (askedTarotCard) {
        client.emit('tarotCard');
      }
    }
  }

  @SubscribeMessage('tarotRead')
  async handleTarotReadEvent(client: MySocket, cardIdx: number) {
    this.logger.debug(
      `🚀 TarotRead request received from ${client.id}: ${cardIdx}번`,
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

    this.logger.debug(`🚀 Send a message to ${client.id}`);
    client.emit('streamEnd');

    return sentMessage;
  }

  private async saveChatLog(client: MySocket) {
    try {
      const createChattingMessageDto = createChattingMessageDtos(
        client.chatRoomId,
        client.chatLog,
      );
      this.chatService.createMessage(
        client.chatRoomId,
        createChattingMessageDto,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to save chat log : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.SAVE_CHATTING_LOG);
    }
  }

  private async createShareLinkId(
    cardIdx: number,
    result: string,
  ): Promise<string> {
    try {
      const createTarotResultDto: CreateTarotResultDto =
        CreateTarotResultDto.fromResult(cardIdx, result);
      return await this.tarotService.createTarotResult(createTarotResultDto);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to create share link ID : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.SAVE_TAROT_RESULT);
    }
  }
}

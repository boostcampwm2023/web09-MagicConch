import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatService } from 'src/chat/chat.service';
import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import ChatbotService from 'src/chatbot/chatbot.interface';
import { ERR_MSG } from 'src/common/constants/errors';
import {
  ASK_TAROTCARD_MESSAGE_CANDIDATES,
  WELCOME_MESSAGE,
} from 'src/common/constants/socket';
import { ChatLog } from 'src/common/types/chatbot';
import type { Socket } from 'src/common/types/socket';
import { readStream, string2Uint8ArrayStream } from 'src/common/utils/stream';
import { LoggerService } from 'src/logger/logger.service';
import { CreateTarotResultDto } from 'src/tarot/dto/create-tarot-result.dto';
import { TarotService } from 'src/tarot/tarot.service';

@Injectable()
export class SocketService {
  constructor(
    @Inject('ChatbotService') private readonly chatbotService: ChatbotService,
    private readonly chatService: ChatService,
    private readonly tarotService: TarotService,
    private readonly logger: LoggerService,
  ) {}

  initClient(client: Socket) {
    client.chatLog = [];
    client.chatEnd = false;
  }

  sendWelcomeMessage(client: Socket) {
    return this.streamMessage(client, () =>
      string2Uint8ArrayStream(WELCOME_MESSAGE),
    );
  }

  async handleMessageEvent(client: Socket, message: string) {
    try {
      const sentMessage = await this.streamMessage(client, () =>
        this.chatbotService.generateTalk(client.chatLog, message),
      );

      client.chatLog.push({ isHost: false, message: message });
      client.chatLog.push({ isHost: true, message: sentMessage });

      if (
        ASK_TAROTCARD_MESSAGE_CANDIDATES.some((string) =>
          sentMessage.includes(string),
        )
      ) {
        client.emit('tarotCard');
      }

      return sentMessage;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to handle message event : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.HANDLE_MESSAGE);
    }
  }

  async handleTarotReadEvent(client: Socket, cardIdx: number) {
    try {
      const sentMessage = await this.streamMessage(client, () =>
        this.chatbotService.generateTarotReading(client.chatLog, cardIdx),
      );

      client.chatLog.push({ isHost: true, message: sentMessage });

      client.chatEnd = true;

      const shareLinkId = await this.createShareLinkId(cardIdx, sentMessage);
      client.emit('chatEnd', shareLinkId);

      const { roomId } = await this.createRoom(client);
      await this.saveChatLogs(roomId, client.chatLog);

      return sentMessage;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to handle tarot read event : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.HANDLE_MESSAGE);
    }
  }

  private async streamMessage(
    client: Socket,
    generateStream: () => Promise<ReadableStream<Uint8Array>>,
  ) {
    client.emit('streamStart');

    const stream = await generateStream();
    const onStreaming = (token: string) => client.emit('streaming', token);

    const sentMessage = await readStream(stream, onStreaming);

    client.emit('streamEnd');

    client.chatLog.push({ isHost: true, message: sentMessage });

    return sentMessage;
  }

  private async createRoom(client: Socket) {
    try {
      const chattingInfo = await this.chatService.createRoom(client.id);
      return chattingInfo;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to create room : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.CREATE_ROOM);
    }
  }

  private async saveChatLogs(roomId: string, chatLogs: ChatLog[]) {
    try {
      const chattingMessages = chatLogs.map((chatLog) =>
        CreateChattingMessageDto.fromChatLog(roomId, chatLog),
      );
      return await this.chatService.createMessage(roomId, chattingMessages);
    } catch (err) {
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
      const tarotResult = CreateTarotResultDto.fromResult(cardIdx, result);
      return await this.tarotService.createTarotResult(tarotResult);
    } catch (err) {
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

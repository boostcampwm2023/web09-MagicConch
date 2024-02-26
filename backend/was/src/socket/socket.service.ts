import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatLog } from '@common/types/chatbot';
import type { AiSocket } from '@common/types/socket';
import { readStream, string2Uint8ArrayStream } from '@common/utils/stream';
import { ERR_MSG } from '@constants/errors';
import {
  ASK_TAROTCARD_MESSAGE_CANDIDATES,
  WELCOME_MESSAGE,
} from '@constants/socket';
import { LoggerService } from '@logger/logger.service';
import { ChatService } from '@chat/chat.service';
import { CreateChattingMessageDto } from '@chat/dto';
import { ChatbotService } from '@chatbot/chatbot.interface';
import { CreateTarotResultDto } from '@tarot/dto';
import { TarotService } from '@tarot/tarot.service';

@Injectable()
export class SocketService {
  constructor(
    @Inject('ChatbotService') private readonly chatbotService: ChatbotService,
    private readonly chatService: ChatService,
    private readonly tarotService: TarotService,
    private readonly logger: LoggerService,
  ) {}

  initClient(client: AiSocket) {
    client.chatLog = [];
    client.chatEnd = false;
  }

  async sendWelcomeMessage(client: AiSocket) {
    try {
      const sentMessage = await this.streamMessage(client, () =>
        string2Uint8ArrayStream(WELCOME_MESSAGE),
      );
      client.chatLog.push({ isHost: true, message: sentMessage });
      return sentMessage;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `🚀 Failed to send welcome message : ${err.message}`,
          err.stack,
        );
      }
      throw new WsException(ERR_MSG.HANDLE_MESSAGE);
    }
  }

  async handleMessageEvent(client: AiSocket, message: string) {
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

  async handleTarotReadEvent(client: AiSocket, cardIdx: number) {
    try {
      const sentMessage = await this.streamMessage(client, () =>
        this.chatbotService.generateTarotReading(client.chatLog, cardIdx),
      );

      client.chatLog.push({ isHost: true, message: sentMessage });

      client.chatEnd = true;

      const shareLinkId = await this.createShareLinkId(cardIdx, sentMessage);
      client.emit('chatEnd', shareLinkId);

      const { memberId, roomId } = await this.createRoom(client);
      await this.saveChatLogs(roomId, memberId, client.chatLog);

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

  async streamMessage(
    client: AiSocket,
    generateStream: () => Promise<ReadableStream<Uint8Array>>,
  ) {
    client.emit('streamStart');

    const stream = await generateStream();
    const onStreaming = (token: string) => client.emit('streaming', token);

    const sentMessage = await readStream(stream, onStreaming);

    client.emit('streamEnd');

    return sentMessage;
  }

  private async createRoom(client: AiSocket) {
    try {
      const chattingInfo = await this.chatService.createRoom(client.user);
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

  private async saveChatLogs(
    roomId: string,
    memberId: string,
    chatLogs: ChatLog[],
  ) {
    try {
      const chattingMessages = chatLogs.map((chatLog) =>
        CreateChattingMessageDto.fromChatLog(roomId, chatLog),
      );
      return await this.chatService.createMessages(
        roomId,
        memberId,
        chattingMessages,
      );
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

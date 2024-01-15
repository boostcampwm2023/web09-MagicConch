import { Inject, Injectable } from '@nestjs/common';
import { ChatService, ChattingInfo } from 'src/chat/chat.service';
import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import ChatbotService from 'src/chatbot/chatbot.interface';
import {
  ASK_TAROTCARD_MESSAGE_CANDIDATES,
  WELCOME_MESSAGE,
} from 'src/common/constants/socket';
import { ChatLog } from 'src/common/types/chatbot';
import type { Socket } from 'src/common/types/socket';
import { readStream, string2Uint8ArrayStream } from 'src/common/utils/stream';
import { CreateTarotResultDto } from 'src/tarot/dto/create-tarot-result.dto';
import { TarotService } from 'src/tarot/tarot.service';

@Injectable()
export class SocketService {
  constructor(
    @Inject('ChatbotService') private readonly chatbotService: ChatbotService,
    private readonly chatService: ChatService,
    private readonly tarotService: TarotService,
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
    const sentMessage = await this.streamMessage(client, () =>
      this.chatbotService.generateTalk(client.chatLog, message),
    );

    client.chatLog.push({ isHost: false, message: message });
    client.chatLog.push({ isHost: true, message: sentMessage });

    if (ASK_TAROTCARD_MESSAGE_CANDIDATES.some(sentMessage.includes)) {
      client.emit('tarotCard');
    }

    return sentMessage;
  }

  async handleTarotReadEvent(client: Socket, cardIdx: number) {
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
    } catch (error) {
      throw new Error(error);
    }
  }

  private async saveChatLogs(roomId: string, chatLogs: ChatLog[]) {
    try {
      const chattingMessages = chatLogs.map((chatLog) =>
        CreateChattingMessageDto.fromChatLog(roomId, chatLog),
      );
      return await this.chatService.createMessage(roomId, chattingMessages);
    } catch (error) {
      throw new Error(error);
    }
  }

  private async createShareLinkId(
    cardIdx: number,
    result: string,
  ): Promise<string> {
    try {
      const tarotResult = CreateTarotResultDto.fromResult(cardIdx, result);
      return await this.tarotService.createTarotResult(tarotResult);
    } catch (error) {
      throw new Error(error);
    }
  }
}

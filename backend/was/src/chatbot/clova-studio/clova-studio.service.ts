import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CHAT_MAX_TOKENS,
  CLOVA_API_KEY_NAMES,
  TAROT_MAX_TOKENS,
} from 'src/common/constants/clova-studio';
import { ERR_MSG } from 'src/common/constants/errors';
import type { ChatLog } from 'src/common/types/chatbot';
import type {
  ClovaStudioApiKeys,
  ClovaStudioMessage,
} from 'src/common/types/clova-studio';
import ChatbotService from '../chatbot.interface';
import { clovaStudioApi } from './api';
import {
  buildTalkMessages,
  buildTarotReadingMessages,
  chatLog2clovaStudioMessages,
} from './message';
import { apiResponseStream2TokenStream } from './stream';

@Injectable()
export class ClovaStudioService implements ChatbotService {
  private readonly apiKeys: ClovaStudioApiKeys;

  constructor(private readonly configService: ConfigService) {
    this.apiKeys = getAPIKeys(this.configService);
  }

  generateTalk(
    chatLogs: ChatLog[],
    userMessage: string,
  ): Promise<ReadableStream<Uint8Array>> {
    const convertedMessages = chatLog2clovaStudioMessages(chatLogs);
    const messages = buildTalkMessages(convertedMessages, userMessage);

    return this.api(messages, CHAT_MAX_TOKENS);
  }

  generateTarotReading(
    chatLogs: ChatLog[],
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>> {
    const convertedMessages = chatLog2clovaStudioMessages(chatLogs);
    const messages = buildTarotReadingMessages(convertedMessages, cardIdx);

    return this.api(messages, TAROT_MAX_TOKENS);
  }

  private async api(
    messages: ClovaStudioMessage[],
    maxTokens: number,
  ): Promise<ReadableStream<Uint8Array>> {
    const options = { apiKeys: this.apiKeys, messages, maxTokens };
    const responseStream = await clovaStudioApi(options);

    return await apiResponseStream2TokenStream(responseStream);
  }
}

export function getAPIKeys(configService: ConfigService) {
  return CLOVA_API_KEY_NAMES.reduce((acc, key) => {
    const value = configService.get(key);

    if (!value) throw new Error(ERR_MSG.AI_API_KEY_NOT_FOUND);

    acc[key.replaceAll('_', '-')] = value;
    return acc;
  }, {} as ClovaStudioApiKeys);
}

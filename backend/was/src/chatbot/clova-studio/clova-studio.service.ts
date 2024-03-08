import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import type { ChatLog } from '@common/types/chatbot';
import type {
  ClovaStudioApiKeys,
  ClovaStudioMessage,
} from '@common/types/clova-studio';
import {
  CHAT_MAX_TOKENS,
  CLOVA_API_KEY_NAMES,
  TAROT_MAX_TOKENS,
} from '@constants/clova-studio';
import { ERR_MSG } from '@constants/errors';
import { ChatbotService } from '../chatbot.interface';
import { clovaStudioApi } from './api';
import {
  buildTalkMessages,
  buildTarotReadingMessages,
  chatLog2clovaStudioMessages,
} from './message';
import { apiResponseStream2TokenStream } from './stream';

dotenv.config();

@Injectable()
export class ClovaStudioService implements ChatbotService {
  private readonly apiKeys: ClovaStudioApiKeys;

  constructor() {
    this.apiKeys = getAPIKeys();
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

    return apiResponseStream2TokenStream(responseStream);
  }
}

export function getAPIKeys() {
  return CLOVA_API_KEY_NAMES.reduce((acc, key) => {
    const value = process.env[key];

    if (!value) throw new Error(ERR_MSG.AI_API_KEY_NOT_FOUND);

    acc[key.replaceAll('_', '-')] = value;
    return acc;
  }, {} as ClovaStudioApiKeys);
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CHAT_MAX_TOKENS,
  CLOVA_API_KEY_NAMES,
  TAROT_MAX_TOKENS,
} from 'src/common/constants/clova-studio';
import { ChatLog } from 'src/common/types/chatbot';
import { ClovaStudioApiKeys } from 'src/common/types/clova-studio';
import ChatbotServiceInterface from '../chatbot.interface';
import clovaStudioApi from './api';
import {
  chatLog2clovaStudioMessages,
  createTarotCardMessage,
  createUserMessage,
} from './message';
import { apiResponseStream2TokenStream } from './stream';

@Injectable()
export class ClovaStudioService implements ChatbotServiceInterface {
  private readonly apiKeys: ClovaStudioApiKeys;

  constructor(private readonly configService: ConfigService) {
    this.apiKeys = getAPIKeys(this.configService);
  }

  createTalk(
    chatLog: ChatLog,
    userMessage: string,
  ): Promise<ReadableStream<Uint8Array>> {
    return this.api({
      apiKeys: this.apiKeys,
      messages: [
        ...chatLog2clovaStudioMessages(chatLog),
        createUserMessage(userMessage),
      ],
      maxTokens: CHAT_MAX_TOKENS,
    });
  }

  createTarotReading(
    chatLog: ChatLog,
    cardIdx: number,
  ): Promise<ReadableStream<Uint8Array>> {
    return this.api({
      apiKeys: this.apiKeys,
      messages: [
        ...chatLog2clovaStudioMessages(chatLog),
        createTarotCardMessage(cardIdx),
      ],
      maxTokens: TAROT_MAX_TOKENS,
    });
  }

  private api(...params: Parameters<typeof clovaStudioApi>) {
    return clovaStudioApi(...params).then(apiResponseStream2TokenStream);
  }
}

function getAPIKeys(configService: ConfigService) {
  return CLOVA_API_KEY_NAMES.reduce((acc, key) => {
    const value = configService.get(key);

    if (!value) throw new Error(`${key}의 값을 찾을 수 없습니다.`);

    acc[key] = value;
    return acc;
  }, {} as ClovaStudioApiKeys);
}

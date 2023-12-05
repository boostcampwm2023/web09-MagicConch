import { WsException } from '@nestjs/websockets';
import {
  CLOVA_URL,
  chatMaxTokens,
  talkSystemMessage,
  tarotMaxTokens,
  tarotReadingSystemMessage,
} from '../common/constants/events';
import { convertClovaEventStream2TokenStream } from './stream';
import type { Chat } from './type';

class ClovaStudio {
  headers;

  constructor(
    public readonly X_NCP_APIGW_API_KEY: string,
    public readonly X_NCP_CLOVASTUDIO_API_KEY: string,
  ) {
    this.headers = {
      'X-NCP-CLOVASTUDIO-API-KEY': X_NCP_CLOVASTUDIO_API_KEY,
      'X-NCP-APIGW-API-KEY': X_NCP_APIGW_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    };
  }

  initChatLog(chatLog: Chat[]): void {
    chatLog.length = 0;
    chatLog.push({ role: 'system', content: talkSystemMessage });
  }

  createTalk(chatLog: Chat[], message: string) {
    chatLog.push({ role: 'user', content: message });
    return this.fetchClovaAPI(chatLog, chatMaxTokens);
  }

  createTarotReading(chatLog: Chat[], tarotName: string) {
    chatLog.push(
      { role: 'system', content: tarotReadingSystemMessage },
      { role: 'user', content: `타로 카드: ${tarotName}\n` },
    );
    return this.fetchClovaAPI(chatLog, tarotMaxTokens);
  }

  private async fetchClovaAPI(chatLog: Chat[], maxTokens: number) {
    const response = await fetch(CLOVA_URL, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        topK: 0,
        includeAiFilters: true,
        maxTokens: maxTokens,
        temperature: 0.28,
        messages: chatLog,
        repeatPenalty: 3.0,
        topP: 0.8,
      }),
    });

    if (!response.ok || !response.body) {
      throw new WsException('서버에서 Clova API를 호출하는데 실패했습니다.');
    }

    const tokenStream = convertClovaEventStream2TokenStream(response.body);
    return tokenStream;
  }
}

export default ClovaStudio;

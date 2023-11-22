import { createTransformer } from './clovaStreamTransform';
import {
  CLOVA_URL,
  chatMaxTokens,
  talkSystemMessage,
  tarotMaxTokens,
  tarotReadingSystemMessage,
} from './constants';

export type Chat = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

class ClovaStudio {
  constructor(
    public readonly X_NCP_APIGW_API_KEY: string,
    public readonly X_NCP_CLOVASTUDIO_API_KEY: string,
  ) {
    this.X_NCP_APIGW_API_KEY = X_NCP_APIGW_API_KEY;
    this.X_NCP_CLOVASTUDIO_API_KEY = X_NCP_CLOVASTUDIO_API_KEY;
  }

  initChatLog(chatLog: Chat[]): void {
    chatLog.length = 0;
    chatLog.push({ role: 'system', content: talkSystemMessage });
  }

  createTalk(chatLog: Chat[], message: string) {
    chatLog.push({ role: 'user', content: message });
    return this.#fetchClovaAPI(chatLog, chatMaxTokens);
  }

  createTarotReading(chatLog: Chat[], tarotName: string) {
    chatLog.push(
      { role: 'system', content: tarotReadingSystemMessage },
      { role: 'user', content: `타로 카드: ${tarotName}\n` },
    );
    return this.#fetchClovaAPI(chatLog, tarotMaxTokens);
  }

  async #fetchClovaAPI(chatLog: Chat[], maxTokens: number) {
    const response = await fetch(CLOVA_URL, {
      method: 'POST',
      headers: {
        'X-NCP-CLOVASTUDIO-API-KEY': this.X_NCP_CLOVASTUDIO_API_KEY,
        'X-NCP-APIGW-API-KEY': this.X_NCP_APIGW_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
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

    if (!response.ok) {
      throw new Error('FATCH ERROR!!!');
    }

    const transformer = createTransformer();
    const messageStream = response.body?.pipeThrough(transformer);

    return messageStream;
  }
}

export default ClovaStudio;

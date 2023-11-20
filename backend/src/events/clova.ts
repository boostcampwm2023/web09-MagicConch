import { createTransformer } from './clovaStreamTransform';
import {
  CLOVA_URL,
  X_NCP_APIGW_API_KEY,
  X_NCP_CLOVASTUDIO_API_KEY,
  talkSystemMessage,
  tarotReadingSystemMessage,
} from './constants';

export type Chat = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export function initChatLog(): Chat[] {
  return [{ role: 'system', content: talkSystemMessage }];
}

export async function createTalk(chatLog: Chat[], message: string) {
  chatLog.push({ role: 'user', content: message });
  return fetchClovaAPI(chatLog);
}

export async function createTarotReading(chatLog: Chat[], tarotName: string) {
  chatLog.push(
    { role: 'system', content: tarotReadingSystemMessage },
    { role: 'user', content: `타로 카드: ${tarotName}\n` },
  );
  return fetchClovaAPI(chatLog, true);
}

async function fetchClovaAPI(chatLog: Chat[], isTarotReading = false) {
  const response = await fetch(CLOVA_URL, {
    method: 'POST',
    headers: {
      'X-NCP-CLOVASTUDIO-API-KEY': X_NCP_CLOVASTUDIO_API_KEY,
      'X-NCP-APIGW-API-KEY': X_NCP_APIGW_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      topK: 0,
      includeAiFilters: true,
      maxTokens: isTarotReading ? 500 : 50,
      temperature: 0.28,
      messages: chatLog,
      repeatPenalty: 3.0,
      topP: 0.8,
    }),
  });

  const transformer = createTransformer();
  const messageStream = response.body?.pipeThrough(transformer);

  return messageStream;
}

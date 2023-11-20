import { createTransformer } from './clovaStreamTransform';
import {
  CLOVA_URL,
  X_NCP_APIGW_API_KEY,
  X_NCP_CLOVASTUDIO_API_KEY,
  baseMessages,
} from './constants';

export async function createTarotReading(message: string, tarotName: string) {
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
      maxTokens: 10,
      temperature: 0.28,
      messages: [
        ...baseMessages,
        {
          role: 'user',
          content: `고민: ${message}\n타로 카드: ${tarotName}\n`,
        },
      ],
      stopBefore: ['###', '고민: ', '타로 카드: '],
      repeatPenalty: 3.0,
      topP: 0.8,
    }),
  });

  const transformer = createTransformer();
  const messageStream = response.body?.pipeThrough(transformer);

  return messageStream;
}

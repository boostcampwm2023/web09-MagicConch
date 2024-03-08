import type {
  ClovaStudioApiKeys,
  ClovaStudioMessage,
} from '@common/types/clova-studio';
import {
  CLOVA_API_DEFAULT_BODY_OPTIONS,
  CLOVA_API_DEFAULT_HEADER_OPTIONS,
  CLOVA_URL,
} from '@constants/clova-studio';
import { ERR_MSG } from '@constants/errors';

type APIOptions = {
  apiKeys: ClovaStudioApiKeys;
  messages: ClovaStudioMessage[];
  maxTokens: number;
};

export async function clovaStudioApi({
  apiKeys,
  messages,
  maxTokens,
}: APIOptions): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(CLOVA_URL, {
    method: 'POST',
    headers: {
      ...CLOVA_API_DEFAULT_HEADER_OPTIONS,
      ...apiKeys,
    },
    body: JSON.stringify({
      ...CLOVA_API_DEFAULT_BODY_OPTIONS,
      maxTokens,
      messages,
    }),
  });

  if (!response.ok) {
    const errorMessage = `${ERR_MSG.AI_API_FAILED}: 상태코드 ${response.statusText}`;
    throw new Error(errorMessage);
  }
  if (!response.body) {
    throw new Error(ERR_MSG.AI_API_RESPONSE_EMPTY);
  }
  return response.body;
}

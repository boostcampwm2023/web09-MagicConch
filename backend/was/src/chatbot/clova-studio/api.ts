import {
  CLOVA_API_DEFAULT_BODY_OPTIONS,
  CLOVA_API_DEFAULT_HEADER_OPTIONS,
  CLOVA_URL,
} from 'src/common/constants/clova-studio';
import {
  ClovaStudioApiKeys,
  ClovaStudioMessage,
} from 'src/common/types/clova-studio';

type APIOptions = {
  apiKeys: ClovaStudioApiKeys;
  messages: ClovaStudioMessage[];
  maxTokens: number;
};

export default async function ({
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

  if (!response.ok || !response.body) {
    throw new Error('서버에서 Clova API를 호출하는데 실패했습니다.');
  }
  return response.body;
}

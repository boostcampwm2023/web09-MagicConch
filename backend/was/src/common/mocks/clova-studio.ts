import { ConfigService } from '@nestjs/config';
import { clovaStudioApi } from 'src/chatbot/clova-studio/api';
import { CLOVA_API_KEY_NAMES } from '../constants/clova-studio';
import { string2Uint8ArrayStream, uint8Array2String } from '../utils/stream';

export const mock_id = '123456-12345-123-12345-12345-1';

export const configServieMock = {
  get(key: string) {
    if (CLOVA_API_KEY_NAMES.includes(key)) {
      return key;
    }
    return undefined;
  },
} as ConfigService;

export const clovaStudioApiMock = clovaStudioApi as jest.MockedFunction<
  typeof clovaStudioApi
>;

export function mock_createResponseStream(
  tokens: string[],
): Promise<ReadableStream<Uint8Array>> {
  const chunk = mock_createResponseChunks(tokens);
  return string2Uint8ArrayStream(chunk);
}

export function mock_createResponseChunks(tokens: string[]): string {
  let chunk = '';

  for (const token of tokens) {
    chunk += `id: ${mock_id}\n`;
    chunk += `event: token\n`;
    chunk += `data: {"message": {"role": "assistant", "content": "${token}" }}\n\n`;
  }

  const result = tokens.join('');

  chunk += `id: ${mock_id}\n`;
  chunk += `event: result\n`;
  chunk += `data: {"message": {"role": "assistant", "content": "${result}" }}\n\n`;

  return chunk;
}

export async function mock_compareTokenStream(
  stream: ReadableStream<Uint8Array>,
  tokens: string[],
): Promise<boolean> {
  const reader = await stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (uint8Array2String(value) !== tokens.shift()) {
      return false;
    }
  }
  return tokens.length === 0;
}

export function mock_isStreamEventString(chunk: string): boolean {
  const regx =
    `^id: ${mock_id}\n` +
    `event: (token|result)\\n` +
    `data: {"message": {"role": "assistant", "content": ".+" }}$`;

  return new RegExp(regx, 'm').test(chunk);
}

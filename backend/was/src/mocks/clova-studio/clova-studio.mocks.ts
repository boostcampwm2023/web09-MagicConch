import { ConfigService } from '@nestjs/config';
import {
  string2Uint8ArrayStream,
  uint8Array2String,
} from '@common/utils/stream';
import { CLOVA_API_KEY_NAMES } from '@constants/clova-studio';
import { clovaStudioApi } from '@chatbot/clova-studio/api';

export const eventIdMock = '123456-12345-123-12345-12345-1';

export const configServieMock = {
  get(key: string) {
    return CLOVA_API_KEY_NAMES.includes(key) ? key : undefined;
  },
} as ConfigService;

export const clovaStudioApiMock = clovaStudioApi as jest.MockedFunction<
  typeof clovaStudioApi
>;

export function createResponseStreamMock(
  tokens: string[],
): Promise<ReadableStream<Uint8Array>> {
  const chunk = createAllEventStringMock(tokens);
  return string2Uint8ArrayStream(chunk);
}

export function createAllEventStringMock(tokens: string[]): string {
  return [...tokens, tokens.join('')].reduce(
    (acc, content, idx) =>
      acc + createEventStringMock(content, idx === tokens.length),
    '',
  );
}

export function createEventStringMock(
  content: string,
  isResult = false,
): string {
  return (
    `id: ${eventIdMock}\n` +
    `event: ${isResult ? 'result' : 'token'}\n` +
    `data: {"message": {"role": "assistant", "content": "${content}" }}\n\n`
  );
}

export async function vaildateTokenStream(
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

export function vaildateEventString(chunk: string): boolean {
  const regx =
    `^id: ${eventIdMock}\n` +
    'event: (token|result)\\n' +
    'data: {"message": {"role": "assistant", "content": ".+" }}$';

  return new RegExp(regx, 'm').test(chunk);
}

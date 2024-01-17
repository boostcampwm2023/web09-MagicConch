import { string2Uint8ArrayStream, uint8Array2String } from '../utils/stream';

export function mock_createResponseStream(
  tokens: string[],
): Promise<ReadableStream<Uint8Array>> {
  const chunk = mock_createResponseChunks(tokens);
  return string2Uint8ArrayStream(chunk);
}

export function mock_createResponseChunks(tokens: string[]): string {
  let chunk = '';

  for (const token of tokens) {
    chunk += `id: ${mock_generateId()}\n`;
    chunk += `event: token\n`;
    chunk += `data: {"message": {"role": "assistant", "content": "${token}" }}\n\n`;
  }

  const result = tokens.join('');

  chunk += `id: ${mock_generateId()}\n`;
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

export function mock_isStreamEventString(
  chunk: string,
  content: string,
): boolean {
  let regx = '';

  regx +=
    '^id: [\\da-zA-Z]{6}-[\\da-zA-Z]{5}-[\\da-zA-Z]{3}-[\\da-zA-Z]{5}-[\\da-zA-Z]{5}-[\\da-zA-Z]{1}\n';
  regx += 'event: (token|result)\n';
  regx += `data: {"message": {"role": "assistant", "content": "${content}"}}$`;

  return new RegExp(regx).test(chunk);
}

export function mock_generateId() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return uuid;
}

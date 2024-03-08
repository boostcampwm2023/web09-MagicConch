import type { ClovaStudioEvent } from '@common/types/clova-studio';
import { string2Uint8Array, uint8Array2String } from '@common/utils/stream';

export function apiResponseStream2TokenStream(
  responseStream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const transformStream = createTransformStream();
  const tokenStream = responseStream.pipeThrough(transformStream);

  return tokenStream;
}

function createTransformStream(): TransformStream<Uint8Array, Uint8Array> {
  const transformer: Transformer<Uint8Array, Uint8Array> = createTransformer();
  const transformStream = new TransformStream<Uint8Array, Uint8Array>(
    transformer,
  );

  return transformStream;
}

// 각 chunk에서 token을 추출하는 transformer 생성
function createTransformer(): Transformer<Uint8Array, Uint8Array> {
  let incompleteEvent = '';

  return {
    // 각 chunk에서 token을 추출해서 controller에 enqueue
    async transform(chunk, controller) {
      const events = splitChunk(chunk);

      if (incompleteEvent) {
        events[0] = incompleteEvent + events[0];
        incompleteEvent = '';
      }

      const extractToken = getTokenExtractor({
        onFail: (event) => (incompleteEvent = event),
      });

      const newChunks = events.map(extractToken).filter(isToken);
      newChunks
        .map(string2Uint8Array)
        .forEach((token) => controller.enqueue(token));
    },
  };
}

export function splitChunk(chunk: Uint8Array): string[] {
  return uint8Array2String(chunk).split('\n\n');
}

type GetTokenExtractorOptions = { onFail: (incompleteEvent: string) => void };

export function getTokenExtractor({
  onFail,
}: GetTokenExtractorOptions): (chunk: string) => string | undefined {
  return (chunk) => {
    const streamEvent = streamEventParse(chunk);

    if (streamEvent === undefined) {
      onFail(chunk);
    }
    if (!streamEvent || streamEvent.event !== 'token') {
      return undefined;
    }

    return streamEvent.data.message.content;
  };
}

function isToken(object: any): object is string {
  return typeof object === 'string';
}

export function streamEventParse(str: string): ClovaStudioEvent | undefined {
  const lines = splitEvent(str);

  const event: any = lines.reduce((event, line) => {
    const [key, value] = extractKeyValue(line);

    try {
      return { ...event, [key]: JSON.parse(value) };
    } catch (err) {
      return { ...event, [key]: value };
    }
  }, {} as any);

  return isStreamEvent(event) ? (event as ClovaStudioEvent) : undefined;
}

function splitEvent(str: string): string[] {
  return str.split('\n');
}

export function extractKeyValue(line: string): [string, string] {
  const splitIdx = line.indexOf(':');

  if (splitIdx > 0) {
    return [line.slice(0, splitIdx).trim(), line.slice(splitIdx + 1).trim()];
  }
  return ['', ''];
}

export function isStreamEvent(object: any): object is ClovaStudioEvent {
  return (
    typeof object === 'object' &&
    object !== null &&
    'id' in object &&
    'event' in object &&
    'data' in object &&
    typeof object.data === 'object' &&
    'message' in object.data &&
    'role' in object.data.message &&
    'content' in object.data.message
  );
}

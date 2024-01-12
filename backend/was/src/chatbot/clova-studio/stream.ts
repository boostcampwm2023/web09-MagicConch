import type { ClovaStudioEvent } from 'src/common/types/clova-studio';

export function convertAPIResponseStream2TokenStream(
  responseStream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const transformStream = createTransformStream();
  const tokenStream = responseStream.pipeThrough(transformStream);

  return tokenStream;
}

/* 아래는 위 함수를 위한 내부 함수들, 유닛 테스트를 위해 export 해 놓은 것. */

export function createTransformStream(): TransformStream<
  Uint8Array,
  Uint8Array
> {
  const transformer: Transformer<Uint8Array, Uint8Array> = createTransformer();
  const transformStream = new TransformStream<Uint8Array, Uint8Array>(
    transformer,
  );

  return transformStream;
}

export function createTransformer(): Transformer<Uint8Array, Uint8Array> {
  const encoder = new TextEncoder();
  let incompleteEvent = '';

  return {
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
        .map((token) => encoder.encode(token))
        .forEach((encodeedToken) => controller.enqueue(encodeedToken));
    },
  };
}

function splitChunk(chunk: Uint8Array): string[] {
  return new TextDecoder().decode(chunk).split('\n\n');
}

type GetTokenExtractorOptions = { onFail: (incompleteEvent: string) => void };

export function getTokenExtractor({
  onFail,
}: GetTokenExtractorOptions): (chunk: string) => string | undefined {
  return (chunk) => {
    const streamEvent = streamEventParse(chunk);

    if (streamEvent === undefined) onFail(chunk);
    if (!streamEvent || streamEvent.event !== 'token') return;

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

    if (key === 'id' || key === 'event') {
      return { ...event, [key]: value };
    }
    if (key === 'data') {
      try {
        return { ...event, [key]: JSON.parse(value) };
      } catch (err) {
        return event;
      }
    }
    return event;
  }, {} as any);

  return isStreamEvent(event) ? (event as ClovaStudioEvent) : undefined;
}

function splitEvent(str: string): string[] {
  return str.split('\n');
}

export function extractKeyValue(line: string): [string, string] {
  const splitIdx = line.indexOf(':');

  if (splitIdx > 0) {
    return [line.slice(0, splitIdx), line.slice(splitIdx + 1)];
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
    'message' in object.data &&
    'role' in object.data.message &&
    'content' in object.data.message
  );
}

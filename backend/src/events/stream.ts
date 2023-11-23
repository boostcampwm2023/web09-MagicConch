import type { ClovaEvent } from './type';

const encoder = new TextEncoder();

export function convertClovaEventStream2TokenStream(
  clovaEventStream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const transformer = createTransformer();
  return clovaEventStream.pipeThrough(transformer);
}

export function readTokenStream(
  stream: ReadableStream<Uint8Array>,
  onStreaming: (token: string) => void,
): Promise<string> {
  let message = '';
  const reader = stream.getReader();

  return new Promise((resolve) => {
    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          resolve(message);
          return;
        }
        const token = new TextDecoder().decode(value);
        message += token;
        onStreaming(message);

        return readStream();
      });
    };
    readStream();
  });
}

export function string2TokenStream(string: string): ReadableStream<Uint8Array> {
  const uint8Array = string2Uint8Array(string);
  const stream = uint8Array2Stream(uint8Array);
  return stream;
}

function createTransformer(): TransformStream<Uint8Array, Uint8Array> {
  let incompleteEvent = '';

  const transformer: Transformer<Uint8Array, Uint8Array> = {
    async transform(chunk, controller) {
      const splitedChunk = new TextDecoder().decode(chunk).split('\n\n');

      if (incompleteEvent) {
        splitedChunk[0] = incompleteEvent + splitedChunk[0];
        incompleteEvent = '';
      }

      const extractToken = (chunk: string): string | undefined => {
        const streamEvent = streamEventParse(chunk);
        if (streamEvent === undefined) {
          incompleteEvent = chunk;
          return;
        }
        if (streamEvent.event !== 'token') {
          return;
        }
        return streamEvent.data.message.content;
      };

      const newChunks = splitedChunk.map(extractToken).filter(isString);

      newChunks
        .map((token) => encoder.encode(token))
        .forEach((encodeedToken) => controller.enqueue(encodeedToken));
    },
  };

  return new TransformStream<Uint8Array, Uint8Array>(transformer);
}

function isString(object: any): object is string {
  return typeof object === 'string';
}

function streamEventParse(str: string): ClovaEvent | undefined {
  const event: any = str.split('\n').reduce((event, line) => {
    const splitIdx = line.indexOf(':');
    const [key, value] = [line.slice(0, splitIdx), line.slice(splitIdx + 1)];

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

  return isStreamEvent(event) ? (event as ClovaEvent) : undefined;
}

function isStreamEvent(object: any): object is ClovaEvent {
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

function string2Uint8Array(string: string): Uint8Array {
  return encoder.encode(string);
}

function uint8Array2Stream(uint8Array: Uint8Array): ReadableStream<Uint8Array> {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  });

  return readableStream;
}

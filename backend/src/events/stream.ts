type ClovaEvent = {
  id: string;
  event: string;
  data: {
    message: {
      role: string;
      content: string;
    };
  };
};

export function convertClovaEventStream2TokenStream(
  clovaEventStream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const transformer = createTransformer();
  return clovaEventStream.pipeThrough(transformer);
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
      const isString = (object: any): object is string =>
        typeof object === 'string';

      const newChunks = splitedChunk.map(extractToken).filter(isString);

      const encoder = new TextEncoder();
      newChunks
        .map((token) => encoder.encode(token))
        .forEach(controller.enqueue);
    },
  };

  return new TransformStream<Uint8Array, Uint8Array>(transformer);
}

function streamEventParse(str: string): ClovaEvent | undefined {
  const event: any = {};

  str.split('\n').forEach((line: string) => {
    const splitIdx = line.indexOf(':');
    const [key, value] = [line.slice(0, splitIdx), line.slice(splitIdx + 1)];

    if (key === 'id' || key === 'event') {
      event[key] = value;
    } else if (key === 'data') {
      try {
        event[key] = JSON.parse(value);
      } catch (e) {}
    }
  });

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

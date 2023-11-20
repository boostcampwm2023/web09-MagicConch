type StreamEvent = {
  id: string;
  event: string;
  data: {
    message: {
      role: string;
      content: string;
    };
  };
};

export function createTransformer() {
  let prevChunk = '';

  return new TransformStream<Uint8Array, Uint8Array>({
    async transform(chunk, controller) {
      const splitedChunk = new TextDecoder().decode(chunk).split('\n\n');
      if (prevChunk) {
        splitedChunk[0] = prevChunk + splitedChunk[0];
        prevChunk = '';
      }

      const newChunks: (string | undefined)[] = splitedChunk
        .map((chunk) => {
          const streamEvent = streamEventParse(chunk);
          if (streamEvent === undefined) {
            prevChunk = chunk;
            return undefined;
          }
          if (streamEvent.event === 'token') {
            return streamEvent.data.message.content;
          }
          return undefined;
        })
        .filter((chunk) => typeof chunk === 'string');

      const encoder = new TextEncoder();
      newChunks.forEach((content) => {
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      });
    },
  });
}

function streamEventParse(str: string): StreamEvent | undefined {
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

  return isStreamEvent(event) ? (event as StreamEvent) : undefined;
}

function isStreamEvent(object: any): object is StreamEvent {
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

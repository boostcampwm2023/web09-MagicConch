export function string2Uint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function uint8Array2String(uint8Array: Uint8Array): string {
  return new TextDecoder().decode(uint8Array).trim();
}

export async function string2Uint8ArrayStream(
  input: string,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(input);

  const readableStream = new ReadableStream({
    async start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    },
  });

  return readableStream;
}

export function readStream(
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

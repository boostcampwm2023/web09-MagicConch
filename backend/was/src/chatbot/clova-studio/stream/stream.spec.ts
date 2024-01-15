import {
  apiResponseStream2TokenStream,
  extractKeyValue,
  getTokenExtractor,
  isStreamEvent,
  splitChunk,
  streamEventParse,
  string2Uint8Array,
  uint8Array2String,
} from './converter';

describe('[chatbot/clova-studio/stream]', () => {
  describe('function splitChunk()', () => {
    const orignalChunk = string2Uint8Array(`id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}

id: aabdfe-dfgwr-edf-hpqwd-f1asd-g
event: token
data: {"message": {"role": "assistant", "content": "녕" }}`);

    const splitChunks = [
      `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}`,
      `id: aabdfe-dfgwr-edf-hpqwd-f1asd-g
event: token
data: {"message": {"role": "assistant", "content": "녕" }}`,
    ];

    it('test (1): 기본 실행 테스트', () => {
      expect(splitChunk(orignalChunk)).toEqual(splitChunks);
    });

    it('test (2): 시작이나 끝에 줄바꿈이 붙은 경우 테스트', () => {
      const originalChunkString = uint8Array2String(orignalChunk);
      const inputs = [
        `\n${originalChunkString}`,
        `\n\n${originalChunkString}`,
        `${originalChunkString}\n`,
        `${originalChunkString}\n\n`,
      ].map(string2Uint8Array);

      inputs.forEach((chunk) => {
        expect(splitChunk(chunk)).toEqual(splitChunks);
      });
    });
  });

  describe('function extractKeyValue()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const testcases = [
        {
          input: `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g`,
          output: ['id', 'aabdfe-dfgwr-edf-hpqwd-f2asd-g'],
        },
        {
          input: `event: token`,
          output: ['event', 'token'],
        },
        {
          input: `data: {"message": {"role": "assistant", "content": "안"}}`,
          output: [
            'data',
            '{"message": {"role": "assistant", "content": "안"}}',
          ],
        },
      ];

      testcases.forEach(({ input, output }) => {
        expect(extractKeyValue(input)).toEqual(output);
      });
    });
  });

  describe('function isStreamEvent()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const input = {
        id: 'aabdfe-dfgwr-edf-hpqwd-f2asd-g',
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };
      expect(isStreamEvent(input)).toBe(true);
    });

    it('test (2): data가 없는 경우', () => {
      const input = {
        id: 'aabdfe-dfgwr-edf-hpqwd-f2asd-g',
        event: 'token',
      };
      expect(isStreamEvent(input)).toBe(false);
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        {
          id: 'aabdfe-dfgwr-edf-hpqwd-f2asd-g',
          event: 'token',
          data: '{"message": {"role": "assistant", "conte',
        },
        {
          id: 'aabdfe-dfgwr-edf-hpqwd-f2asd-g',
          event: 'token',
          data: '',
        },
      ];
      inputs.forEach((input) => {
        expect(isStreamEvent(input)).toBe(false);
      });
    });

    it('test (4): input이 특별한 값일 경우', () => {
      const input = [null, undefined, '', [], {}, () => {}];
      expect(isStreamEvent(input)).toBe(false);
    });
  });

  describe('function streamEventParse()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const input = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}`;
      const output = {
        id: 'aabdfe-dfgwr-edf-hpqwd-f2asd-g',
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };

      expect(streamEventParse(input)).toEqual(output);
    });

    it('test (2): data가 없는 경우', () => {
      const input = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token`;
      expect(streamEventParse(input)).toBe(undefined);
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "conte`,
        `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: `,
        `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
da`,
      ];
      inputs.forEach((input) => {
        expect(streamEventParse(input)).toBe(undefined);
      });
    });

    it('test (4): input이 빈 값일 경우', () => {
      expect(streamEventParse('')).toBe(undefined);
    });
  });

  describe('function getTokenExtractor()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const onFail = jest.fn();
      const extractor = getTokenExtractor({ onFail });
      const event = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}`;

      expect(extractor(event)).toBe('안');
      expect(onFail).not.toHaveBeenCalled();
    });

    it('test (2): onFail이 실행되는 경우', () => {
      const onFail = jest.fn();
      const extractor = getTokenExtractor({ onFail });

      const event = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "conte`;

      expect(extractor(event)).toBe(undefined);
      expect(onFail).toHaveBeenCalledTimes(1);
      expect(onFail).toHaveBeenCalledWith(event);
    });
  });

  describe('function apiResponseStream2TokenStream()', () => {
    it('test (1): 기본 실행 테스트', async () => {
      const chunks = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}

id: aabdfe-dfgwr-edf-hpqwd-f1asd-g
event: token
data: {"message": {"role": "assistant", "content": "녕" }}

id: 7a8c1911-e5c1-40c5-a2f1-06c0f4c1029d
event: token
data: {"message": {"role": "assistant", "content": "하" }}

id: e4081bd0-8a62-4c63-891a-5b65c674ff63
event: token
data: {"message": {"role": "assistant", "content": "세" }}

id: 7e65a894-9e9c-4c0a-83a0-6aae04a557f3
event: token
data: {"message": {"role": "assistant", "content": "요" }}

id: e37be2fb-65f0-43d3-a48e-1d09400eab3b
event: result
data: {"message": {"role": "assistant", "content": "안녕하세요" }}`;

      const tokens = ['안', '녕', '하', '세', '요'];

      const responseStream = await string2Uint8ArrayStream(chunks);
      const tokenStream = apiResponseStream2TokenStream(responseStream);

      const reader = tokenStream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        expect(uint8Array2String(value)).toEqual(tokens.shift());
      }
      expect(tokens.length).toBe(0);
    });
  });
});

async function string2Uint8ArrayStream(
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

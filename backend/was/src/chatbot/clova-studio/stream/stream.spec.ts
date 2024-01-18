import { string2Uint8Array, uint8Array2String } from 'src/common/utils/stream';
import {
  createAllEventStringMock,
  createResponseStreamMock,
  eventIdMock,
  vaildateEventString,
  vaildateTokenStream,
} from 'src/mocks/clova-studio';
import {
  apiResponseStream2TokenStream,
  extractKeyValue,
  getTokenExtractor,
  isStreamEvent,
  splitChunk,
  streamEventParse,
} from './converter';

describe('[chatbot/clova-studio/stream]', () => {
  describe('function splitChunk()', () => {
    const tokens = ['안', '녕', '하', '세', '요'];
    const orignalChunk = string2Uint8Array(createAllEventStringMock(tokens));

    const vaildateChunk = (chunks: string[]) => {
      expect(chunks.length).toBe(tokens.length + 1);

      chunks.forEach((chunk) => {
        expect(vaildateEventString(chunk)).toBeTruthy();
      });
    };

    it('test (1): 기본 실행 테스트', () => {
      const splitedChunks = splitChunk(orignalChunk);
      vaildateChunk(splitedChunks);
    });

    it('test (2): 시작이나 끝에 줄바꿈이 붙은 경우 테스트', () => {
      const orignalChunkString = uint8Array2String(orignalChunk);
      const inputs = [
        `\n${orignalChunkString}`,
        `\n\n${orignalChunkString}`,
        `${orignalChunkString}\n`,
        `${orignalChunkString}\n\n`,
      ].map(string2Uint8Array);

      inputs.forEach((input) => {
        const splitedChunks = splitChunk(input);
        vaildateChunk(splitedChunks);
      });
    });
  });

  describe('function extractKeyValue()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const testcases = [
        {
          input: `id: ${eventIdMock}`,
          output: ['id', eventIdMock],
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
        id: eventIdMock,
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };
      expect(isStreamEvent(input)).toBeTruthy();
    });

    it('test (2): data가 없는 경우', () => {
      const input = {
        id: eventIdMock,
        event: 'token',
      };
      expect(isStreamEvent(input)).toBeFalsy();
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        {
          id: eventIdMock,
          event: 'token',
          data: '{"message": {"role": "assistant", "conte',
        },
        {
          id: eventIdMock,
          event: 'token',
          data: '',
        },
      ];
      inputs.forEach((input) => {
        expect(isStreamEvent(input)).toBeFalsy();
      });
    });

    it('test (4): input이 특별한 값일 경우', () => {
      const input = [null, undefined, '', [], {}, () => {}];
      expect(isStreamEvent(input)).toBeFalsy();
    });
  });

  describe('function streamEventParse()', () => {
    it('test (1): 기본 실행 테스트', () => {
      const input = `id: ${eventIdMock}
event: token
data: {"message": {"role": "assistant", "content": "안"}}`;
      const output = {
        id: eventIdMock,
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };

      expect(streamEventParse(input)).toEqual(output);
    });

    it('test (2): data가 없는 경우', () => {
      const input = `id: ${eventIdMock}
event: token`;
      expect(streamEventParse(input)).toBeUndefined();
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        `id: ${eventIdMock}
event: token
data: {"message": {"role": "assistant", "conte`,
        `id: ${eventIdMock}
event: token
data: `,
        `id: ${eventIdMock}
event: token
da`,
      ];
      inputs.forEach((input) => {
        expect(streamEventParse(input)).toBeUndefined();
      });
    });

    it('test (4): input이 빈 값일 경우', () => {
      expect(streamEventParse('')).toBeUndefined();
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

      expect(extractor(event)).toBeUndefined();
      expect(onFail).toHaveBeenCalledTimes(1);
      expect(onFail).toHaveBeenCalledWith(event);
    });
  });

  describe('function apiResponseStream2TokenStream()', () => {
    it('test (1): 기본 실행 테스트', async () => {
      const tokens = ['안', '녕', '하', '세', '요'];

      const responseStream = await createResponseStreamMock(tokens);
      const tokenStream = apiResponseStream2TokenStream(responseStream);

      expect(await vaildateTokenStream(tokenStream, tokens)).toBeTruthy();
    });
  });
});

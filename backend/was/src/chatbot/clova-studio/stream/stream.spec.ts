import {
  mock_compareTokenStream,
  mock_createResponseChunks,
  mock_createResponseStream,
  mock_generateId,
  mock_isStreamEventString,
} from 'src/common/mocks/clova-studio';
import { string2Uint8Array, uint8Array2String } from 'src/common/utils/stream';
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

    const orignalChunk = string2Uint8Array(mock_createResponseChunks(tokens));

    const vaildateChunk = (chunks: string[]) => {
      expect(chunks.length).toBe(tokens.length + 1);

      chunks.forEach((chunk, index) => {
        if (index === tokens.length) {
          expect(mock_isStreamEventString(chunk, tokens.join(''))).toBe(true);
        } else {
          expect(mock_isStreamEventString(chunk, tokens[index])).toBe(true);
        }
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
      const mock_id = mock_generateId();
      const testcases = [
        {
          input: `id: ${mock_id}`,
          output: ['id', mock_id],
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
        id: mock_generateId(),
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };
      expect(isStreamEvent(input)).toBe(true);
    });

    it('test (2): data가 없는 경우', () => {
      const input = {
        id: mock_generateId(),
        event: 'token',
      };
      expect(isStreamEvent(input)).toBe(false);
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        {
          id: mock_generateId(),
          event: 'token',
          data: '{"message": {"role": "assistant", "conte',
        },
        {
          id: mock_generateId(),
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
    const mock_id = mock_generateId();

    it('test (1): 기본 실행 테스트', () => {
      const input = `id: ${mock_id}
event: token
data: {"message": {"role": "assistant", "content": "안"}}`;
      const output = {
        id: mock_id,
        event: 'token',
        data: { message: { role: 'assistant', content: '안' } },
      };

      expect(streamEventParse(input)).toEqual(output);
    });

    it('test (2): data가 없는 경우', () => {
      const input = `id: ${mock_id}
event: token`;
      expect(streamEventParse(input)).toBe(undefined);
    });

    it('test (3): data가 불완전한 경우', () => {
      const inputs = [
        `id: ${mock_id}
event: token
data: {"message": {"role": "assistant", "conte`,
        `id: ${mock_id}
event: token
data: `,
        `id: ${mock_id}
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
      const tokens = ['안', '녕', '하', '세', '요'];

      const responseStream = await mock_createResponseStream(tokens);
      const tokenStream = apiResponseStream2TokenStream(responseStream);

      expect(mock_compareTokenStream(tokenStream, tokens)).toBe(true);
    });
  });
});

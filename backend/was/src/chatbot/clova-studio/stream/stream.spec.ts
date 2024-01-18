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

    const vaildateSplitedChunks = (chunks: string[]) => {
      expect(chunks.length).toBe(tokens.length + 1);

      chunks.forEach((chunk) => {
        expect(vaildateEventString(chunk)).toBeTruthy();
      });
    };

    it('하나의 chunk에 event가 여러 개 있을 때, 이벤트 별로 분리해서 반환', () => {
      const splitedChunks = splitChunk(orignalChunk);
      vaildateSplitedChunks(splitedChunks);
    });

    it('입력값에 시작이나 끝에 줄바꿈이나 공백이 들어가도 정상적으로 분리해서 반환', () => {
      const orignalChunkString = uint8Array2String(orignalChunk);
      const inputs = [
        `\n${orignalChunkString}`,
        `\n\n${orignalChunkString}`,
        `${orignalChunkString}\n`,
        `${orignalChunkString}\n\n`,
        `  ${orignalChunkString}`,
        `${orignalChunkString}  `,
      ].map(string2Uint8Array);

      inputs.forEach((input) => {
        const splitedChunks = splitChunk(input);
        vaildateSplitedChunks(splitedChunks);
      });
    });
  });

  describe('function extractKeyValue()', () => {
    it('event 문자열에서 key, value를 뽑아 object로 생성해 반환', () => {
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
    it('입력된 object가 event 객체 형식이 맞는지 여부를 반환', () => {
      expect(
        isStreamEvent({
          id: eventIdMock,
          event: 'token',
          data: { message: { role: 'assistant', content: '안' } },
        }),
      ).toBeTruthy();

      expect(
        isStreamEvent({
          date: '2023-12-15',
          content: '부스트캠프 8기 수료식',
        }),
      ).toBeFalsy();
    });

    it('data 값이 존재하지 않는 object일 경우, false를 반환', () => {
      const input = {
        id: eventIdMock,
        event: 'token',
      };
      expect(isStreamEvent(input)).toBeFalsy();
    });

    it('data 값이 있지만 완전하지 않은 값일 경우, false를 반환', () => {
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

    it('input이 event와 상관없는 특별한 형식일 경우, false를 반환', () => {
      const input = [null, undefined, '', [], {}, () => {}];
      expect(isStreamEvent(input)).toBeFalsy();
    });
  });

  describe('function streamEventParse()', () => {
    it('event가 문자열로 주어질 경우 object로 파싱해서 반환', () => {
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

    it('input이 완전한 event의 문자열이 아닐 경우 undefined를 반환', () => {
      const inputs = [
        `id: ${eventIdMock}\nevent: token`,
        `id: ${eventIdMock}\nevent: token\ndata: {"message": {"role": "assistant", "conte`,
        `id: ${eventIdMock}\nevent: token\ndata: `,
        `id: ${eventIdMock}\nevent: token\nda`,
      ];
      inputs.forEach((input) => {
        expect(streamEventParse(input)).toBeUndefined();
      });
    });

    it('input가 빈 값인 경우에도 undefined를 반환', () => {
      expect(streamEventParse('')).toBeUndefined();
    });
  });

  describe('function getTokenExtractor()', () => {
    it('event string에서 token을 추출해서 반환, 추출에 성공한 경우에는 onFail 콜백이 실행되지 않는다.', () => {
      const onFail = jest.fn();
      const extractor = getTokenExtractor({ onFail });
      const event = `id: aabdfe-dfgwr-edf-hpqwd-f2asd-g
event: token
data: {"message": {"role": "assistant", "content": "안"}}`;

      expect(extractor(event)).toBe('안');
      expect(onFail).not.toHaveBeenCalled();
    });

    it('token 추출에 실패하는 경우에는 undefined를 반환하고 onFail 콜백이 실행된다.', () => {
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
    it('api의 response로 받은 stream을 token만을 chunk로 하는 stream를 변환', async () => {
      const tokens = ['안', '녕', '하', '세', '요'];

      const responseStream = await createResponseStreamMock(tokens);
      const tokenStream = apiResponseStream2TokenStream(responseStream);

      expect(await vaildateTokenStream(tokenStream, tokens)).toBeTruthy();
    });
  });
});

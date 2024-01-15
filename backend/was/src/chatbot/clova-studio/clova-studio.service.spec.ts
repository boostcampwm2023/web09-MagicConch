import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CLOVA_API_KEY_NAMES } from 'src/common/constants/clova-studio';
import {
  string2Uint8ArrayStream,
  uint8Array2String,
} from 'src/common/utils/stream';
import { clovaStudioApi } from './api';
import { ClovaStudioService } from './clova-studio.service';

jest.mock('./api');
const mockClovaStudioApi = clovaStudioApi as jest.MockedFunction<
  typeof clovaStudioApi
>;

class MockConfigService {
  get(key: string) {
    if (CLOVA_API_KEY_NAMES.includes(key)) {
      return 'key data';
    }
    return undefined;
  }
}

describe('ClovaStudioService', () => {
  let service: ClovaStudioService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClovaStudioService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    service = module.get<ClovaStudioService>(ClovaStudioService);
  });

  it('test (1): ClovaStudioService 정의', () => {
    expect(service).toBeDefined();
  });

  it('test (2): 대화 생성', async () => {
    mockAPI();

    const tokens = ['안', '녕', '하', '세', '요'];
    const tokenStream = await service.generateTalk([], '안녕!');

    const reader = tokenStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      expect(uint8Array2String(value)).toEqual(tokens.shift());
    }
    expect(tokens.length).toBe(0);
  });

  it('test (3): 타로 상담 결과 생성', async () => {
    mockAPI();

    const tokens = ['안', '녕', '하', '세', '요'];
    const tokenStream = await service.generateTarotReading([], 21);

    const reader = tokenStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      expect(uint8Array2String(value)).toEqual(tokens.shift());
    }
    expect(tokens.length).toBe(0);
  });
});

function mockAPI() {
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

  mockClovaStudioApi.mockReturnValueOnce(string2Uint8ArrayStream(chunks));
}

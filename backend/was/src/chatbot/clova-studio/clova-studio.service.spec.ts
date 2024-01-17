import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CLOVA_API_KEY_NAMES } from 'src/common/constants/clova-studio';
import {
  mock_compareTokenStream,
  mock_createResponseChunks,
} from 'src/common/mocks/clova-studio';
import { string2Uint8ArrayStream } from 'src/common/utils/stream';
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
  const tokens = ['안', '녕', '하', '세', '요'];

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
    mockAPI(tokens);

    const tokenStream = await service.generateTalk([], '안녕!');

    const result = await mock_compareTokenStream(tokenStream, tokens);
    expect(result).toBeTruthy();
  });

  it('test (3): 타로 상담 결과 생성', async () => {
    mockAPI(tokens);

    const tokenStream = await service.generateTarotReading([], 21);

    const result = await mock_compareTokenStream(tokenStream, tokens);
    expect(result).toBeTruthy();
  });
});

function mockAPI(tokens: string[]) {
  const chunks = mock_createResponseChunks(tokens);
  mockClovaStudioApi.mockReturnValueOnce(string2Uint8ArrayStream(chunks));
}

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CLOVA_API_KEY_NAMES } from 'src/common/constants/clova-studio';
import {
  clovaStudioApiMock,
  configServieMock,
  mock_compareTokenStream,
  mock_createResponseChunks,
} from 'src/common/mocks/clova-studio';
import { string2Uint8ArrayStream } from 'src/common/utils/stream';
import { ClovaStudioService, getAPIKeys } from './clova-studio.service';

jest.mock('./api');

describe('ClovaStudioService', () => {
  let service: ClovaStudioService;
  const tokens = ['안', '녕', '하', '세', '요'];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClovaStudioService,
        { provide: ConfigService, useValue: configServieMock },
      ],
    }).compile();

    service = module.get<ClovaStudioService>(ClovaStudioService);
  });

  it('ClovaStudioService 생성', () => {
    expect(service).toBeDefined();
  });

  it('clova api key 불러 옴', () => {
    const apiKeys = getAPIKeys(configServieMock);

    CLOVA_API_KEY_NAMES.forEach((key) => {
      expect(apiKeys[key.replaceAll('_', '-')]).toBe(key);
    });
  });

  it('대화 생성', async () => {
    mockAPI(tokens);

    const tokenStream = await service.generateTalk([], '안녕!');

    const result = await mock_compareTokenStream(tokenStream, tokens);
    expect(result).toBeTruthy();
  });

  it('타로 상담 결과 생성', async () => {
    mockAPI(tokens);

    const tokenStream = await service.generateTarotReading([], 21);

    const result = await mock_compareTokenStream(tokenStream, tokens);
    expect(result).toBeTruthy();
  });
});

function mockAPI(tokens: string[]) {
  const chunks = mock_createResponseChunks(tokens);
  clovaStudioApiMock.mockReturnValueOnce(string2Uint8ArrayStream(chunks));
}

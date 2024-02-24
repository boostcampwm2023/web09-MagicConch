import {
  clovaStudioApiMock,
  configServieMock,
  createAllEventStringMock,
  vaildateTokenStream,
} from 'src/mocks/clova-studio';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { string2Uint8ArrayStream } from '@common/utils/stream';
import { ClovaStudioService } from './clova-studio.service';

jest.mock('./api');

describe('ClovaStudioService', () => {
  let clovaStudioService: ClovaStudioService;
  const tokens = ['안', '녕', '하', '세', '요'];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClovaStudioService,
        { provide: ConfigService, useValue: configServieMock },
      ],
    }).compile();

    clovaStudioService = module.get<ClovaStudioService>(ClovaStudioService);
  });

  it('ClovaStudioService 생성', () => {
    expect(clovaStudioService).toBeDefined();
  });

  describe('ClovaStudioService.generateTalk()', () => {
    it('사용자의 메세지 입력으로 AI의 답변을 생성해서 token stream 형식으로 반환', async () => {
      setApiMock(tokens);

      const tokenStream = await clovaStudioService.generateTalk([], '안녕!');

      const result = await vaildateTokenStream(tokenStream, tokens);
      expect(result).toBeTruthy();
    });
  });

  describe('ClovaStudioService.generateTarotReading()', () => {
    it('사용자가 뽑은 카드 인덱스로 AI의 해설을 생성해서 token stream 형식으로 반환', async () => {
      setApiMock(tokens);

      const tokenStream = await clovaStudioService.generateTarotReading([], 21);

      const result = await vaildateTokenStream(tokenStream, tokens);
      expect(result).toBeTruthy();
    });
  });
});

function setApiMock(tokens: string[]) {
  const chunks = createAllEventStringMock(tokens);
  clovaStudioApiMock.mockReturnValueOnce(string2Uint8ArrayStream(chunks));
}

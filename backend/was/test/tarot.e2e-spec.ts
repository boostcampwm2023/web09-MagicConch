import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  TarotService as MockedTarotService,
  invalidResultId,
  resultId,
} from 'src/tarot/__mocks__';
import { TarotController } from 'src/tarot/tarot.controller';
import { TarotService } from 'src/tarot/tarot.service';
import * as request from 'supertest';

describe('Tarot', () => {
  let app: INestApplication;
  let tarotService: MockedTarotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TarotService],
      controllers: [TarotController],
    })
      .overrideProvider(TarotService)
      .useClass(MockedTarotService)
      .compile();

    app = moduleRef.createNestApplication();
    tarotService = moduleRef.get<MockedTarotService>(TarotService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /tarot/card/:cardNo', () => {
    it('GET /tarot/card/0', () => {
      return request(app.getHttpServer())
        .get('/tarot/card/0')
        .expect(200)
        .expect(tarotService.findTarotCardByCardNo(0));
    });

    it('GET /tarot/card/invalidCardNo [정수형이 아닌 카드 번호]', () => {
      return request(app.getHttpServer())
        .get('/tarot/card/invalidCardNo')
        .expect(400);
    });

    it('GET /tarot/card/-1 [존재하지 않는 카드 번호]', () => {
      return request(app.getHttpServer()).get('/tarot/card/-1').expect(404);
    });
  });

  describe('GET /tarot/result/:id', () => {
    it(`GET /tarot/result/${resultId}`, () => {
      return request(app.getHttpServer())
        .get(`/tarot/result/${resultId}`)
        .expect(200)
        .expect(tarotService.findTarotResultById(resultId));
    });

    it('GET /tarot/result/invalidUUID [UUID 형식이 아닌 아이디]', () => {
      return request(app.getHttpServer())
        .get('/tarot/result/invalidUUID')
        .expect(400);
    });

    it(`GET /tarot/result/${invalidResultId} [존재하지 않는 아이디]`, () => {
      return request(app.getHttpServer())
        .get(`/tarot/result/${invalidResultId}`)
        .expect(404);
    });
  });
});

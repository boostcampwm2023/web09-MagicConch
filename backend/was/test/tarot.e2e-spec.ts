import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { invalidResultId, resultId } from 'src/tarot/__mocks__/tarot-result';
import { TarotService as MockedTarotService } from 'src/tarot/__mocks__/tarot.service';
import { TarotController } from 'src/tarot/tarot.controller';
import { TarotService } from 'src/tarot/tarot.service';
import * as request from 'supertest';

describe('Tarot', () => {
  let app: INestApplication;
  let tarotService: MockedTarotService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TarotController],
      providers: [TarotService],
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
    it('[올바른 카드 번호] GET /tarot/card/0', () => {
      return request(app.getHttpServer())
        .get('/tarot/card/0')
        .expect(200)
        .expect(tarotService.findTarotCardByCardNo(0));
    });

    it('[정수형이 아닌 카드 번호] GET /tarot/card/invalidCardNo', () => {
      return request(app.getHttpServer())
        .get('/tarot/card/invalidCardNo')
        .expect(400);
    });

    it('[존재하지 않는 카드 번호] GET /tarot/card/-1', () => {
      return request(app.getHttpServer()).get('/tarot/card/-1').expect(404);
    });
  });

  describe('GET /tarot/result/:id', () => {
    it(`[올바른 아이디] GET /tarot/result/${resultId}`, () => {
      return request(app.getHttpServer())
        .get(`/tarot/result/${resultId}`)
        .expect(200)
        .expect(tarotService.findTarotResultById(resultId));
    });

    it('[UUID 형식이 아닌 아이디] GET /tarot/result/invalidUUID', () => {
      return request(app.getHttpServer())
        .get('/tarot/result/invalidUUID')
        .expect(400);
    });

    it(`[존재하지 않는 아이디] GET /tarot/result/${invalidResultId}`, () => {
      return request(app.getHttpServer())
        .get(`/tarot/result/${invalidResultId}`)
        .expect(404);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUCKET_URL } from 'src/common/constants/etc';
import { TarotCard, TarotCardPack, TarotResult } from 'src/tarot/entities';
import { TarotController } from 'src/tarot/tarot.controller';
import { TarotService } from 'src/tarot/tarot.service';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { id, wrongId } from './constants';

describe('Tarot', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/entities/*.entity.{js,ts}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([TarotCard, TarotResult, TarotCardPack]),
      ],
      controllers: [TarotController],
      providers: [TarotService],
    }).compile();

    app = moduleRef.createNestApplication();
    entityManager = moduleRef.get(EntityManager);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /tarot/card/:cardNo', () => {
    beforeAll(async () => {
      const tarotCard: TarotCard = new TarotCard();
      tarotCard.cardNo = 0;
      tarotCard.ext = '.jpg';
      await entityManager.save(tarotCard);
    });

    describe('성공', () => {
      it('[올바른 카드 번호] GET /tarot/card/0', () => {
        return request(app.getHttpServer())
          .get('/tarot/card/0')
          .expect(200)
          .expect((res) =>
            expect(res.body).toEqual({ cardUrl: `${BUCKET_URL}/basic/0.jpg` }),
          );
      });
    });

    describe('실패', () => {
      it('[정수형이 아닌 카드 번호] GET /tarot/card/invalidCardNo', () => {
        return request(app.getHttpServer())
          .get('/tarot/card/invalidCardNo')
          .expect(400);
      });

      it('[존재하지 않는 카드 번호] GET /tarot/card/-1', () => {
        return request(app.getHttpServer()).get('/tarot/card/-1').expect(404);
      });
    });
  });

  describe('GET /tarot/result/:id', () => {
    beforeAll(async () => {
      const tarotResult: TarotResult = new TarotResult();
      tarotResult.id = id;
      tarotResult.cardUrl = `${BUCKET_URL}/basic/0.jpg`;
      tarotResult.message = '0번 타로 카드에 대한 해설입니다';
      await entityManager.save(tarotResult);
    });

    describe('성공', () => {
      it(`[올바른 아이디] GET /tarot/result/${id}`, () => {
        return request(app.getHttpServer())
          .get(`/tarot/result/${id}`)
          .expect(200)
          .expect((res) =>
            expect(res.body).toEqual({
              cardUrl: `${BUCKET_URL}/basic/0.jpg`,
              message: '0번 타로 카드에 대한 해설입니다',
            }),
          );
      });
    });

    describe('실패', () => {
      it('[UUID 형식이 아닌 아이디] GET /tarot/result/invalidUUID', () => {
        return request(app.getHttpServer())
          .get('/tarot/result/invalidUUID')
          .expect(400);
      });

      it(`[존재하지 않는 아이디] GET /tarot/result/${wrongId}`, () => {
        return request(app.getHttpServer())
          .get(`/tarot/result/${wrongId}`)
          .expect(404);
      });
    });
  });
});

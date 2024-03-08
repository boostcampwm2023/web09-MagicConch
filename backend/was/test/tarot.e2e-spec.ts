import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BUCKET_URL, ExtEnum } from '@constants/etc';
import { TarotCard, TarotCardPack, TarotResult } from '@tarot/entities';
import { TarotController } from '@tarot/tarot.controller';
import { TarotService } from '@tarot/tarot.service';
import { id, wrongId } from './common/constants';
import { SqliteModule } from './common/database/sqlite.module';

describe('Tarot', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SqliteModule,
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
      tarotCard.ext = ExtEnum.JPG;
      await entityManager.save(tarotCard);
    });

    it('올바른 카드 번호를 받으면 그에 해당하는 카드 이미지 URL을 반환한다.', () => {
      return request(app.getHttpServer())
        .get('/tarot/card/0')
        .expect(200)
        .expect((res) =>
          expect(res.body).toEqual({ cardUrl: `${BUCKET_URL}/basic/0.jpg` }),
        );
    });

    describe('잘못된 카드 번호를 받으면 에러를 던진다.', () => {
      [
        {
          scenario: '정수형이 아닌 카드 번호를 받으면 400번 에러를 반환한다.',
          route: '/tarot/card/invalidCardNo',
          status: 400,
        },
        {
          scenario: '존재하지 않는 카드 번호를 받으면 404번 에러를 반환한다.',
          route: '/tarot/card/-1',
          status: 404,
        },
      ].forEach(({ scenario, route, status }) => {
        it(scenario, () => {
          return request(app.getHttpServer()).get(route).expect(status);
        });
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

    it('올바른 아이디를 받으면 그에 해당하는 타로 결과를 반환한다.', () => {
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

    describe('잘못된 아이디를 받으면 에러를 던진다.', () => {
      [
        {
          scenario: 'UUID 형식이 아닌 아이디를 받으면 400번 에러를 반환한다.',
          route: '/tarot/result/invalidUUID',
          status: 400,
        },
        {
          scenario: '존재하지 않는 아이디를 받으면 404번 에러를 반환한다.',
          route: `/tarot/result/${wrongId}`,
          status: 404,
        },
      ].forEach(({ scenario, route, status }) => {
        it(scenario, () => {
          return request(app.getHttpServer()).get(route).expect(status);
        });
      });
    });
  });
});

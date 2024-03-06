import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@auth/guard';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { Member } from '@members/entities';
import { MembersController } from '@members/members.controller';
import { MembersService } from '@members/members.service';
import { diffJwtToken, id, jwtToken } from './common/constants';
import { SqliteModule } from './common/database/sqlite.module';

describe('Member', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SqliteModule, TypeOrmModule.forFeature([Member])],
      controllers: [MembersController],
      providers: [MembersService, JwtStrategy, JwtAuthGuard],
    }).compile();

    app = moduleRef.createNestApplication();
    entityManager = moduleRef.get(EntityManager);

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /members', () => {
    const route: string = '/members';

    beforeAll(async () => {
      const member: Member = new Member();
      member.id = id;
      member.email = 'tarotmilktea@kakao.com';
      member.providerId = 0;
      member.nickname = '타로밀크티';
      member.profileUrl =
        'https://kr.object.ncloudstorage.com/magicconch/basic/0.jpg';
      await entityManager.save(member);
    });

    [
      {
        scenario:
          '로그인 한 사용자가 자신의 정보를 조회하면 해당하는 닉네임과 프로필 URL을 전송한다.',
        cookie: `magicconch=${jwtToken}`,
        status: 200,
        body: {
          nickname: '타로밀크티',
          profileUrl:
            'https://kr.object.ncloudstorage.com/magicconch/basic/0.jpg',
        },
      },
      {
        scenario:
          '로그인 하지 않은 사용자가 사용자 정보 조회를 시도하면 401번 에러를 반환한다.',
        status: 401,
      },
      {
        scenario: '존재하지 않는 사용자 정보를 받으면 404번 에러를 반환한다.',
        cookie: `magicconch=${diffJwtToken}`,
        status: 404,
      },
    ].forEach(({ scenario, cookie, status, body }) => {
      it(scenario, () => {
        if (!cookie) {
          return request(app.getHttpServer()).get(route).expect(status);
        }
        if (!body) {
          return request(app.getHttpServer())
            .get(route)
            .set('Cookie', cookie)
            .expect(status);
        }
        return request(app.getHttpServer())
          .get(route)
          .set('Cookie', cookie)
          .expect(status)
          .expect((res) => expect(res.body).toEqual(body));
      });
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { MockedKakaoAuthService } from 'src/auth/__mocks__/kakao.auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtAuthGuard, SocketJwtAuthGuard } from 'src/auth/guard';
import { AuthService, KakaoAuthService } from 'src/auth/service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RedisCacheModule } from 'src/common/config/cache/redis-cache.module';
import { Member } from 'src/members/entities';
import * as request from 'supertest';
import { jwtToken } from './common/constants';
import { SqliteModule } from './common/database/sqlite.module';

dotenv.config();

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RedisCacheModule.register(),
        PassportModule,
        JwtModule.registerAsync({
          useFactory: (): JwtModule => {
            return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
            };
          },
        }),
        SqliteModule,
        TypeOrmModule.forFeature([Member]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        KakaoAuthService,
        JwtStrategy,
        JwtAuthGuard,
        SocketJwtAuthGuard,
      ],
    })
      .overrideProvider(KakaoAuthService)
      .useClass(MockedKakaoAuthService)
      .compile();

    app = moduleRef.createNestApplication();

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /oauth/authenticate', () => {
    [
      {
        scenario: '로그인 한 사용자가 요청을 보내면 true를 반환한다.',
        route: '/oauth/authenticate',
        cookie: `magicconch=${jwtToken}`,
        status: 200,
        body: { isAuthenticated: true },
      },
      {
        scenario: '로그인 하지 않은 사용자가 요청을 보내면 false를 반환한다.',
        route: '/oauth/authenticate',
        status: 200,
        body: { isAuthenticated: false },
      },
    ].forEach(({ scenario, route, cookie, status, body }) => {
      it(scenario, () => {
        if (cookie) {
          return request(app.getHttpServer())
            .get(route)
            .set('Cookie', cookie)
            .expect(status)
            .expect((res) => expect(res.body).toEqual(body));
        }
        return request(app.getHttpServer())
          .get(route)
          .expect(status)
          .expect((res) => expect(res.body).toEqual(body));
      });
    });
  });

  describe('GET /oauth/login/kakao', () => {
    const code: string = 'code';
    const wrongCode: string = 'wrongCode';
    const codeGetUserFail: string = 'codeGetUserFail';

    it('올바른 인증 코드를 발급 받은 사용자는 로그인 할 수 있다.', () => {
      return request(app.getHttpServer())
        .get(`/oauth/login/kakao?code=${code}`)
        .expect(200);
    });

    describe('잘못된 요청을 받으면 에러를 던진다.', () => {
      [
        {
          scenario:
            '이미 로그인 한 사용자가 로그인을 시도하면 400번 에러를 반환한다.',
          route: '/oauth/login/kakao',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario: '인증 코드가 누락되면 400번 에러를 반환한다.',
          route: '/oauth/login/kakao',
          status: 400,
        },
        {
          scenario: '잘못된 인증 코드를 받으면 401번 에러를 반환한다.',
          route: `/oauth/login/kakao?code=${wrongCode}`,
          status: 401,
        },
        {
          scenario: '사용자 정보 조회에 실패하면 400번 에러를 반환한다.',
          route: `/oauth/login/kakao?code=${codeGetUserFail}`,
          status: 400,
        },
      ].forEach(({ scenario, route, cookie, status }) => {
        it(scenario, () => {
          if (cookie) {
            return request(app.getHttpServer())
              .get(route)
              .set('Cookie', cookie)
              .expect(status);
          }
          return request(app.getHttpServer()).get(route).expect(status);
        });
      });
    });
  });

  describe('GET /oauth/logout', () => {
    [
      {
        scenario: '로그인 한 사용자는 로그아웃 할 수 있다.',
        route: '/oauth/logout',
        cookie: `magicconch=${jwtToken}`,
        status: 200,
      },
      {
        scenario:
          '로그인 하지 않은 사용자가 로그아웃을 시도하면 401번 에러를 반환한다.',
        route: '/oauth/logout',
        status: 401,
      },
    ].forEach(({ scenario, route, cookie, status }) => {
      it(scenario, () => {
        if (cookie) {
          return request(app.getHttpServer())
            .get(route)
            .set('Cookie', cookie)
            .expect(status);
        }
        return request(app.getHttpServer()).get(route).expect(status);
      });
    });
  });
});

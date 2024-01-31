import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChattingMessageDto, UpdateChattingRoomDto } from 'src/chat/dto';
import { ChattingMessage, ChattingRoom } from 'src/chat/entities';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { Member } from 'src/members/entities';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { id, jwtToken, wrongId } from './constants';

describe('Chat', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let savedRoom: ChattingRoom;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/entities/*.entity.{js,ts}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ChattingRoom, ChattingMessage, Member]),
      ],
      providers: [ChatService, JwtAuthGuard, JwtStrategy],
      controllers: [ChatController],
    }).compile();

    app = moduleRef.createNestApplication();

    entityManager = moduleRef.get(EntityManager);

    const member: Member = new Member();
    member.email = 'tarotmilktea@kakao.com';
    member.providerId = PROVIDER_ID.KAKAO;
    await entityManager.save(member);

    const room: ChattingRoom = new ChattingRoom();
    room.id = id;
    room.participant = member;
    savedRoom = await entityManager.save(room);

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /chat/ai', () => {
    describe('성공', () => {
      it('[인증 받은 사용자] GET /chat/ai', () => {
        return request(app.getHttpServer())
          .get('/chat/ai')
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(200)
          .expect((res) =>
            expect(res.body).toEqual([
              {
                id: savedRoom.id,
                title: savedRoom.title,
              },
            ]),
          );
      });
    });

    describe('실패', () => {
      it('[인증 받지 않은 사용자] GET /chat/ai', () => {
        return request(app.getHttpServer()).get('/chat/ai').expect(401);
      });
    });
  });

  describe('GET /chat/ai/:id', () => {
    let messages: ChattingMessageDto[] = [];

    beforeAll(async () => {
      const chatLogs = [
        {
          isHost: true,
          message: '어떤 고민이 있어?',
        },
        {
          isHost: false,
          message: '오늘 운세를 알고 싶어',
        },
      ];
      for (const chatLog of chatLogs) {
        const message: ChattingMessage = new ChattingMessage();
        message.isHost = chatLog.isHost;
        message.message = chatLog.message;
        message.room = savedRoom;
        await entityManager.save(message);
        messages.push(ChattingMessageDto.fromEntity(message));
      }
    });

    describe('성공', () => {
      it(`[인증 받은 사용자/올바른 아이디] GET /chat/ai/${id}`, () => {
        return request(app.getHttpServer())
          .get(`/chat/ai/${id}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(200)
          .expect((res) => expect(res.body).toEqual(messages));
      });
    });

    describe('실패', () => {
      [
        {
          scenario: `[인증 받지 않은 사용자/올바른 아이디] GET /chat/ai/${id}`,
          route: `/chat/ai/${id}`,
          status: 401,
        },
        {
          scenario:
            '[인증 받은 사용자/UUID 형식이 아닌 아이디] GET /chat/ai/invalidUUID',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario: `[인증 받은 사용자/존재하지 않는 아이디] GET /chat/ai/${wrongId}`,
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          status: 404,
        },
      ].forEach(({ scenario, route, cookie, status }) => {
        it(scenario, () => {
          if (!cookie) {
            return request(app.getHttpServer()).get(route).expect(status);
          }
          return request(app.getHttpServer())
            .get(route)
            .set('Cookie', cookie)
            .expect(status);
        });
      });
    });
  });

  describe('PATCH /chat/ai/:id', () => {
    const updateRoomDto: UpdateChattingRoomDto = {
      title: '수정된 채팅방 제목',
    };

    describe('성공', () => {
      it(`[인증 받은 사용자/올바른 아이디] PATCH /chat/ai/${id}`, async () => {
        await request(app.getHttpServer())
          .patch(`/chat/ai/${id}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .send(updateRoomDto)
          .expect(200);

        const res = await request(app.getHttpServer())
          .get(`/chat/ai/`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(200);

        const room: ChattingRoom[] = res.body.filter(
          (room: ChattingRoom) => id === room.id,
        );
        expect(room).toHaveLength(1);
        expect(room[0].title).toBe(updateRoomDto.title);
      });
    });

    describe('실패', () => {
      [
        {
          scenario: `[인증 받지 않은 사용자/올바른 아이디] PATCH /chat/ai/${id}`,
          route: `/chat/ai/${id}`,
          body: updateRoomDto,
          status: 401,
        },
        {
          scenario:
            '[인증 받은 사용자/UUID 형식이 아닌 아이디] PATCH /chat/ai/invalidUUID',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          body: updateRoomDto,
          status: 400,
        },
        {
          scenario: `[인증 받은 사용자/존재하지 않는 아이디] PATCH /chat/ai/${wrongId}`,
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          body: updateRoomDto,
          status: 404,
        },
      ].forEach(({ scenario, route, cookie, body, status }) => {
        it(scenario, () => {
          if (!cookie) {
            return request(app.getHttpServer())
              .patch(route)
              .send(body)
              .expect(status);
          }
          return request(app.getHttpServer())
            .patch(route)
            .set('Cookie', cookie)
            .send(body)
            .expect(status);
        });
      });
    });
  });

  describe('DELETE /chat/ai/:id', () => {
    describe('성공', () => {
      it(`[인증 받은 사용자/올바른 아이디] DELETE /chat/ai/${id}`, async () => {
        await request(app.getHttpServer())
          .delete(`/chat/ai/${id}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(200);

        await request(app.getHttpServer())
          .delete(`/chat/ai/${id}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(404);
      });
    });

    describe('실패', () => {
      [
        {
          scenario: `[인증 받지 않은 사용자/올바른 아이디] DELETE /chat/ai/${id}`,
          route: `/chat/ai/${id}`,
          status: 401,
        },
        {
          scenario:
            '[인증 받은 사용자/UUID 형식이 아닌 아이디] DELETE /chat/ai/invalidUUID',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario: `[인증 받은 사용자/존재하지 않는 아이디] DELETE /chat/ai/${wrongId}`,
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          status: 404,
        },
      ].forEach(({ scenario, route, cookie, status }) => {
        it(scenario, () => {
          if (!cookie) {
            return request(app.getHttpServer()).delete(route).expect(status);
          }
          return request(app.getHttpServer())
            .delete(route)
            .set('Cookie', cookie)
            .expect(status);
        });
      });
    });
  });
});

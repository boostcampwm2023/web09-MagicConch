import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import {
  ChattingMessageDto,
  ChattingRoomDto,
  ChattingRoomGroupDto,
  UpdateChattingRoomDto,
} from 'src/chat/dto';
import { ChattingMessage, ChattingRoom } from 'src/chat/entities';
import { ProviderIdEnum } from 'src/common/constants/etc';
import { Member } from 'src/members/entities';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';
import { diffJwtToken, id, id2, jwtToken, wrongId } from './common/constants';
import { SqliteModule } from './common/database/sqlite.module';

const JAN_15: string = '2024-01-15';
const JAN_26: string = '2024-01-26';

describe('Chat', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let member: Member;
  let savedRoom: ChattingRoom;
  const oneDay: Date = new Date(JAN_15);
  const anotherDay: Date = new Date(JAN_26);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SqliteModule,
        TypeOrmModule.forFeature([ChattingRoom, ChattingMessage, Member]),
      ],
      providers: [ChatService, JwtAuthGuard, JwtStrategy],
      controllers: [ChatController],
    }).compile();

    app = moduleRef.createNestApplication();

    entityManager = moduleRef.get(EntityManager);

    member = new Member();
    member.email = 'tarotmilktea@kakao.com';
    member.providerId = ProviderIdEnum.KAKAO;
    await entityManager.save(member);

    const diffMember: Member = new Member();
    diffMember.email = 'tarotmilktea2@kakako.com';
    diffMember.providerId = ProviderIdEnum.KAKAO;
    await entityManager.save(diffMember);

    const room: ChattingRoom = new ChattingRoom();
    room.id = id;
    room.title = `${JAN_15}일자 채팅방`;
    room.createdAt = oneDay;
    room.participant = member;
    savedRoom = await entityManager.save(room);

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /chat/ai', () => {
    beforeAll(async () => {
      const anotherRoom: ChattingRoom = new ChattingRoom();
      anotherRoom.id = id2;
      anotherRoom.title = `${JAN_26}일자 채팅방`;
      anotherRoom.createdAt = anotherDay;
      anotherRoom.participant = member;
      await entityManager.save(anotherRoom);
    });

    [
      {
        scenario:
          '인증 받은 사용자는 자신의 채팅방 목록을 생성일자 내림차순으로 조회할 수 있다.',
        route: '/chat/ai',
        cookie: `magicconch=${jwtToken}`,
        status: 200,
        body: [
          {
            date: anotherDay.toLocaleDateString('ko-KR'),
            rooms: [
              {
                id: id2,
                title: `${JAN_26}일자 채팅방`,
                createdAt: anotherDay.toLocaleDateString('ko-KR'),
              },
            ],
          },
          {
            date: oneDay.toLocaleDateString('ko-KR'),
            rooms: [
              {
                id,
                title: `${JAN_15}일자 채팅방`,
                createdAt: oneDay.toLocaleDateString('ko-KR'),
              },
            ],
          },
        ],
      },
      {
        scenario:
          '인증 받지 않은 사용자가 채팅방 목록 조회를 시도하면 401번 에러를 반환한다.',
        route: '/chat/ai',
        status: 401,
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
        return request(app.getHttpServer()).get(route).expect(status);
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
          order: 1,
        },
        {
          isHost: false,
          message: '오늘 운세를 알고 싶어',
          order: 2,
        },
      ];
      for (const chatLog of chatLogs) {
        const message: ChattingMessage = new ChattingMessage();
        message.isHost = chatLog.isHost;
        message.message = chatLog.message;
        message.order = chatLog.order;
        message.room = savedRoom;
        await entityManager.save(message);
        messages.push(ChattingMessageDto.fromEntity(message));
      }
    });

    it('인증 받은 사용자는 특정 채팅방에서 오간 메시지 목록을 조회할 수 있다.', () => {
      return request(app.getHttpServer())
        .get(`/chat/ai/${id}`)
        .set('Cookie', `magicconch=${jwtToken}`)
        .expect(200)
        .expect((res) => expect(res.body).toEqual(messages));
    });

    describe('잘못된 요청을 받으면 에러를 던진다.', () => {
      [
        {
          scenario:
            '인증 받지 않은 사용자가 채팅 메시지 조회를 시도하면 401번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          status: 401,
        },
        {
          scenario:
            '인증 받은 사용자가 UUID 형식이 아닌 아이디를 전달하면 400번 에러를 반환한다.',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario:
            '인증 받은 사용자가 존재하지 않는 아이디를 전달하면 404번 에러를 반환한다.',
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          status: 404,
        },
        {
          scenario:
            '권한이 없는 사용자가 채팅 메시지 조회를 시도하면 403번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          cookie: `magicconch=${diffJwtToken}`,
          status: 403,
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

  describe('PATCH /chat/ai/:id', () => {
    const updateRoomDto: UpdateChattingRoomDto = {
      title: '수정된 채팅방 제목',
    };

    it('인증 받은 사용자는 특정 채팅방 정보를 수정할 수 있다.', async () => {
      await request(app.getHttpServer())
        .patch(`/chat/ai/${id}`)
        .set('Cookie', `magicconch=${jwtToken}`)
        .send(updateRoomDto)
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(`/chat/ai/`)
        .set('Cookie', `magicconch=${jwtToken}`)
        .expect(200);

      const rooms: ChattingRoomDto[] = res.body.reduce(
        (acc: ChattingRoomDto[], { rooms }: ChattingRoomGroupDto) => {
          rooms.forEach((room: ChattingRoomDto) => acc.push(room));
          return acc;
        },
        [],
      );

      const room: ChattingRoomDto[] = rooms.filter(
        (room: ChattingRoomDto) => id === room.id,
      );
      expect(room).toHaveLength(1);
      expect(room[0].title).toBe(updateRoomDto.title);
    });

    describe('잘못된 요청을 받으면 에러를 던진다.', () => {
      [
        {
          scenario:
            '인증 받지 않은 사용자가 채팅방 정보 수정을 시도하면 401번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          body: updateRoomDto,
          status: 401,
        },
        {
          scenario:
            '인증 받은 사용자가 UUID 형식이 아닌 아이디를 전달하면 400번 에러를 반환한다.',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          body: updateRoomDto,
          status: 400,
        },
        {
          scenario:
            '인증 받은 사용자가 존재하지 않는 아이디를 전달하면 404번 에러를 반환한다.',
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          body: updateRoomDto,
          status: 404,
        },
        {
          scenario:
            '권한이 없는 사용자가 채팅방 정보 수정을 시도하면 403번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          cookie: `magicconch=${diffJwtToken}`,
          status: 403,
        },
      ].forEach(({ scenario, route, cookie, body, status }) => {
        it(scenario, () => {
          if (cookie) {
            return request(app.getHttpServer())
              .patch(route)
              .set('Cookie', cookie)
              .send(body)
              .expect(status);
          }
          return request(app.getHttpServer())
            .patch(route)
            .send(body)
            .expect(status);
        });
      });
    });
  });

  describe('DELETE /chat/ai/:id', () => {
    beforeEach(async () => {
      await entityManager.save(savedRoom);
    });

    it('인증 받은 사용자는 특정 채팅방을 삭제할 수 있다.', async () => {
      await request(app.getHttpServer())
        .delete(`/chat/ai/${id}`)
        .set('Cookie', `magicconch=${jwtToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .delete(`/chat/ai/${id}`)
        .set('Cookie', `magicconch=${jwtToken}`)
        .expect(404);
    });

    describe('잘못된 요청을 받으면 에러를 던진다.', () => {
      [
        {
          scenario:
            '인증 받지 않은 사용자가 채팅방 삭제를 시도하면 401번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          status: 401,
        },
        {
          scenario:
            '인증 받은 사용자가 UUID 형식이 아닌 아이디를 전달하면 400번 에러를 반환한다.',
          route: '/chat/ai/invalidUUID',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario:
            '인증 받은 사용자가 존재하지 않는 아이디를 전달하면 404번 에러를 반환한다.',
          route: `/chat/ai/${wrongId}`,
          cookie: `magicconch=${jwtToken}`,
          status: 404,
        },
        {
          scenario:
            '권한이 없는 사용자가 채팅방 삭제를 시도하면 403번 에러를 반환한다.',
          route: `/chat/ai/${id}`,
          cookie: `magicconch=${diffJwtToken}`,
          status: 403,
        },
      ].forEach(({ scenario, route, cookie, status }) => {
        it(scenario, () => {
          if (cookie) {
            return request(app.getHttpServer())
              .delete(route)
              .set('Cookie', cookie)
              .expect(status);
          }
          return request(app.getHttpServer()).delete(route).expect(status);
        });
      });
    });
  });
});

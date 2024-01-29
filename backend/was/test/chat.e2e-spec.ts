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

describe('Chat', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let savedRoom: ChattingRoom;
  const jwtToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6IjFoIn0.eyJlbWFpbCI6InRhcm90bWlsa3RlYUBrYWthby5jb20iLCJwcm92aWRlcklkIjowLCJhY2Nlc3NUb2tlbiI6ImFjY2Vzc1Rva2VuIn0.DpYPxbwWGA6kYkyYb3vJSS0PTiyy3ihkiM54Bm6XAoM';
  const id: string = '12345678-1234-5678-1234-567812345670';
  const wrongId: string = '12345678-0000-0000-1234-567812345678';

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

    beforeAll(() => {
      [
        {
          isHost: true,
          message: '어떤 고민이 있어?',
        },
        {
          isHost: false,
          message: '오늘 운세를 알고 싶어',
        },
      ].forEach(async (chatLog) => {
        const message: ChattingMessage = new ChattingMessage();
        message.isHost = chatLog.isHost;
        message.message = chatLog.message;
        message.room = savedRoom;
        await entityManager.save(message);
        messages.push(ChattingMessageDto.fromEntity(message));
      });
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
      it(`[인증 받지 않은 사용자/올바른 아이디] GET /chat/ai/${id}`, () => {
        return request(app.getHttpServer()).get(`/chat/ai/${id}`).expect(401);
      });

      it('[인증 받은 사용자/UUID 형식이 아닌 아이디] GET /chat/ai/invalidUUID', () => {
        return request(app.getHttpServer())
          .get('/chat/ai/invalidUUID')
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(400);
      });

      it(`[인증 받은 사용자/존재하지 않는 아이디] GET /chat/ai/${wrongId}`, () => {
        return request(app.getHttpServer())
          .get(`/chat/ai/${wrongId}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(404);
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
      it(`[인증 받지 않은 사용자/올바른 아이디] PATCH /chat/ai/${id}`, () => {
        return request(app.getHttpServer())
          .patch(`/chat/ai/${id}`)
          .send(updateRoomDto)
          .expect(401);
      });

      it('[인증 받은 사용자/UUID 형식이 아닌 아이디] PATCH /chat/ai/invalidUUID', () => {
        return request(app.getHttpServer())
          .patch('/chat/ai/invalidUUID')
          .set('Cookie', `magicconch=${jwtToken}`)
          .send(updateRoomDto)
          .expect(400);
      });

      it(`[인증 받은 사용자/존재하지 않는 아이디] PATCH /chat/ai/${wrongId}`, () => {
        return request(app.getHttpServer())
          .patch(`/chat/ai/${wrongId}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .send(updateRoomDto)
          .expect(404);
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
      it(`[인증 받지 않은 사용자/올바른 아이디] DELETE /chat/ai/${id}`, () => {
        return request(app.getHttpServer())
          .delete(`/chat/ai/${id}`)
          .expect(401);
      });

      it('[인증 받은 사용자/UUID 형식이 아닌 아이디] DELETE /chat/ai/invalidUUID', () => {
        return request(app.getHttpServer())
          .delete('/chat/ai/invalidUUID')
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(400);
      });

      it(`[인증 받은 사용자/존재하지 않는 아이디] DELETE /chat/ai/${wrongId}`, () => {
        return request(app.getHttpServer())
          .delete(`/chat/ai/${wrongId}`)
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(404);
      });
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChattingMessage, ChattingRoom } from 'src/chat/entities';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { Member } from 'src/members/entities';
import * as request from 'supertest';
import { EntityManager } from 'typeorm';

describe('Chat', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let savedMember: Member;
  let savedRoom: ChattingRoom;
  const jwtToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6IjFoIn0.eyJlbWFpbCI6InRhcm90bWlsa3RlYUBrYWthby5jb20iLCJwcm92aWRlcklkIjowLCJhY2Nlc3NUb2tlbiI6ImFjY2Vzc1Rva2VuIn0.DpYPxbwWGA6kYkyYb3vJSS0PTiyy3ihkiM54Bm6XAoM';

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
    savedMember = await entityManager.save(member);

    const room: ChattingRoom = ChattingRoom.fromMember(savedMember);
    savedRoom = await entityManager.save(room);

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
    });

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

  /**
   * TODO
   */
  describe('GET /chat/ai/:id', () => {});

  describe('GET /chat/ai', () => {});

  describe('PATCH /chat/ai/:id', () => {});

  describe('DELETE /chat/ai/:id', () => {});
});

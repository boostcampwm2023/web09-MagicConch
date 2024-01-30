import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { RedisCacheModule } from 'src/common/config/cache/redis-cache.module';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { CreateMemberDto, UpdateMemberDto } from 'src/members/dto';
import { Member } from 'src/members/entities';
import { Repository } from 'typeorm';
import { OAuthTokenDto, ProfileDto } from '../dto';
import { AuthService } from './auth.service';

dotenv.config();

describe('AuthService', () => {
  let authService: AuthService;
  let membersRepository: Repository<Member>;
  const profileDto: ProfileDto = {
    email: 'tarotmilktea@kakao.com',
    nickname: '타로밀크티',
  };
  const oauthTokenDto: OAuthTokenDto = {
    token_type: 'authorization',
    access_token: 'accessToken',
    expires_in: 0,
    refresh_token: 'refreshToken',
    refresh_token_expires_in: 0,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        RedisCacheModule.register(),
        JwtModule.registerAsync({
          useFactory: (): JwtModule => {
            return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
            };
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    membersRepository = moduleRef.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    describe('성공', () => {
      it('회원가입 한다 (신규회원)', async () => {
        [
          {
            providerId: PROVIDER_ID.KAKAO,
            profile: profileDto,
            token: oauthTokenDto,
          },
          {
            providerId: PROVIDER_ID.NAVER,
            profile: profileDto,
            token: oauthTokenDto,
          },
          {
            providerId: PROVIDER_ID.GOOGLE,
            profile: profileDto,
            token: oauthTokenDto,
          },
        ].forEach(async (scenario) => {
          const createMemberDto: CreateMemberDto = CreateMemberDto.fromProfile(
            scenario.providerId,
            scenario.profile,
          );
          const member: Member = Member.fromDto(createMemberDto);

          const memberSaveMock = jest
            .spyOn(membersRepository, 'save')
            .mockResolvedValueOnce(member);

          await expect(
            authService.signup(
              scenario.providerId,
              scenario.profile,
              scenario.token,
            ),
          ).resolves.not.toThrow();
          expect(memberSaveMock).toHaveBeenCalledWith(member);
        });
      });
    });
  });

  describe('login', () => {
    describe('성공', () => {
      it('로그인 한다 (기존회원)', () => {
        [
          {
            id: 'id1',
            providerId: PROVIDER_ID.KAKAO,
            profile: profileDto,
            token: oauthTokenDto,
          },
          {
            id: 'id2',
            providerId: PROVIDER_ID.NAVER,
            profile: profileDto,
            token: oauthTokenDto,
          },
          {
            id: 'id3',
            providerId: PROVIDER_ID.GOOGLE,
            profile: profileDto,
            token: oauthTokenDto,
          },
        ].forEach(async (scenario) => {
          const updateMemberDto: UpdateMemberDto = UpdateMemberDto.fromProfile(
            scenario.providerId,
            scenario.profile,
          );

          const memberUpdateMock = jest
            .spyOn(membersRepository, 'update')
            .mockResolvedValueOnce({ affected: 1 } as any);

          await expect(
            authService.login(
              scenario.id,
              scenario.providerId,
              scenario.profile,
              scenario.token,
            ),
          ).resolves.not.toThrow();
          expect(memberUpdateMock).toHaveBeenCalledWith(
            { id: scenario.id },
            updateMemberDto,
          );
        });
      });
    });
  });
});

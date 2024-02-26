import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisCacheModule } from '@common/config/cache/redis-cache.module';
import { ProviderIdEnum } from '@constants/etc';
import { CreateMemberDto, UpdateMemberDto } from '@members/dto';
import { Member } from '@members/entities';
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
    it('신규회원은 회원가입 할 수 있다.', async () => {
      [
        {
          providerId: ProviderIdEnum.KAKAO,
          profile: profileDto,
          token: oauthTokenDto,
        },
        {
          providerId: ProviderIdEnum.NAVER,
          profile: profileDto,
          token: oauthTokenDto,
        },
        {
          providerId: ProviderIdEnum.GOOGLE,
          profile: profileDto,
          token: oauthTokenDto,
        },
      ].forEach(async ({ providerId, profile, token }) => {
        const createMemberDto: CreateMemberDto = CreateMemberDto.fromProfile(
          providerId,
          profile,
        );
        const member: Member = Member.fromDto(createMemberDto);

        const memberSaveMock = jest
          .spyOn(membersRepository, 'save')
          .mockResolvedValueOnce(member);

        await expect(
          authService.signup(providerId, profile, token),
        ).resolves.not.toThrow();
        expect(memberSaveMock).toHaveBeenCalledWith(member);
      });
    });
  });

  describe('login', () => {
    it('기존회원은 로그인 할 수 있다.', () => {
      [
        {
          id: 'id1',
          providerId: ProviderIdEnum.KAKAO,
          profile: profileDto,
          token: oauthTokenDto,
        },
        {
          id: 'id2',
          providerId: ProviderIdEnum.NAVER,
          profile: profileDto,
          token: oauthTokenDto,
        },
        {
          id: 'id3',
          providerId: ProviderIdEnum.GOOGLE,
          profile: profileDto,
          token: oauthTokenDto,
        },
      ].forEach(async ({ id, providerId, profile, token }) => {
        const updateMemberDto: UpdateMemberDto = UpdateMemberDto.fromProfile(
          providerId,
          profile,
        );

        const memberUpdateMock = jest
          .spyOn(membersRepository, 'update')
          .mockResolvedValueOnce({ affected: 1 } as any);

        await expect(
          authService.login(id, providerId, profile, token),
        ).resolves.not.toThrow();
        expect(memberUpdateMock).toHaveBeenCalledWith(
          { id: id },
          updateMemberDto,
        );
      });
    });
  });
});

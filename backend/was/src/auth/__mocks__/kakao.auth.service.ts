import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderIdEnum, ProviderName } from '@constants/etc';
import { AUTH_CODEMAP } from '@exceptions/codemap';
import { CustomException } from '@exceptions/custom-exception';
import { Member } from '@members/entities';
import { JwtPayloadDto, OAuthTokenDto, ProfileDto } from '../dto';
import { KakaoAccessTokenInfoDto, KakaoTokenDto } from '../dto/kakao';
import { CacheKey } from '../interface/cache-key';
import { AuthService } from '../service';

const authCodes: string[] = ['code', 'codeGetUserFail'];
const correctAccessToken: string = 'accessToken';
const correctRefreshToken: string = 'refreshToken';
const wrongAccessToken: string = 'wrongAccessToken';
const wrongRefreshToken: string = 'wrongRefreshToken';

const profile: ProfileDto = {
  email: 'tarotmilktea@kakao.com',
  nickname: '타로밀크티',
};

const tokens: Record<string, KakaoTokenDto> = {
  code: {
    token_type: 'authorization code',
    access_token: correctAccessToken,
    expires_in: 3600,
    refresh_token: correctRefreshToken,
    refresh_token_expires_in: 360000,
  },
  codeGetUserFail: {
    token_type: 'authorization code',
    access_token: wrongAccessToken,
    expires_in: 3600,
    refresh_token: wrongRefreshToken,
    refresh_token_expires_in: 360000,
  },
};

const kakaoAccessTokenInfo: KakaoAccessTokenInfoDto = {
  id: 0,
  expires_in: 3600,
  app_id: 0,
};

export class MockedKakaoAuthService extends AuthService {
  constructor(
    readonly jwtService: JwtService,
    @InjectRepository(Member)
    readonly membersRepository: Repository<Member>,
    @Inject(CACHE_MANAGER)
    readonly cacheManager: Cache,
  ) {
    super(jwtService, membersRepository, cacheManager);
    this.init(ProviderName.KAKAO);
  }

  async loginOAuth(code: string): Promise<string> {
    const token: KakaoTokenDto = this.requestToken(code);
    const profile: ProfileDto = this.getUser(token.access_token ?? '');
    const member: Member | null = await this.findMemberByEmail(
      profile.email,
      ProviderIdEnum.KAKAO,
    );
    if (member) {
      return this.login(
        member.id,
        ProviderIdEnum.KAKAO,
        profile,
        OAuthTokenDto.fromKakao(token),
      );
    }
    return this.signup(
      ProviderIdEnum.KAKAO,
      profile,
      OAuthTokenDto.fromKakao(token),
    );
  }

  async logoutOAuth(user: JwtPayloadDto): Promise<boolean> {
    const tokenInfo: KakaoAccessTokenInfoDto = this.getAccessTokenInfo(
      user.accessToken,
    );
    if (tokenInfo) {
      return this.requestLogout(user.accessToken);
    }
    const key: CacheKey = { email: user.email, providerId: user.providerId };
    const keyString: string = JSON.stringify(key);
    const refreshToken: string | undefined =
      await this.cacheManager.get<string>(keyString);
    const newToken: KakaoTokenDto = this.refreshToken(refreshToken ?? '');
    return this.requestLogout(newToken.access_token);
  }

  private requestToken(code: string): KakaoTokenDto {
    if (authCodes.includes(code)) {
      return tokens[code];
    }
    throw new CustomException(AUTH_CODEMAP.KAKAO_TOKEN_REQUEST_FAILED);
  }

  private refreshToken(refreshToken: string): KakaoTokenDto {
    if (refreshToken === correctRefreshToken) {
      return tokens.code;
    }
    throw new CustomException(AUTH_CODEMAP.KAKAO_TOKEN_REFRESH_FAILED);
  }

  private getUser(accessToken: string): ProfileDto {
    if (accessToken === correctAccessToken) {
      return profile;
    }
    throw new CustomException(AUTH_CODEMAP.KAKAO_USER_FAILED);
  }

  private getAccessTokenInfo(accessToken: string): KakaoAccessTokenInfoDto {
    if (accessToken === correctAccessToken) {
      return kakaoAccessTokenInfo;
    }
    return kakaoAccessTokenInfo;
  }

  private requestLogout(accessToken: string): boolean {
    return accessToken === correctAccessToken;
  }
}
